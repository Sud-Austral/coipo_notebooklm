# Generación óptima de presentaciones enriquecidas

Método destilado de enriquecer *Día 1 — Meteorología aplicada a incendios forestales*
(238 diapositivas de CONAF) con fotografía real, fondos y diagramas 3D. Recoge lo que
funcionó, lo que falló y **por qué** falló, para aplicarlo a otros PPTX.

Todo lo que hay aquí está comprobado ejecutando, no razonado. Donde algo no se verificó,
se dice.

---

## 1. El principio que ordena todo lo demás

**Verificar el resultado, no el código.** Escribir el generador, que compile y que las
cuentas cuadren no es verificación. Verificar es *mirar la lámina renderizada*.

De los cinco fallos serios de esta sesión, **cuatro habrían muerto en el primer minuto
con una sola mirada al resultado**. El quinto —el peor— sobrevivió precisamente porque
sí miré, pero comprobando la propiedad equivocada (ver §6).

Corolario operativo: el bucle es siempre `generar → renderizar → MIRAR → corregir`,
nunca `generar → razonar que debería estar bien → entregar`.

---

## 2. Arquitectura: insertar, jamás reconstruir

La regla que hizo posible garantizar fidelidad:

> No se reconstruye ninguna diapositiva original. Se abre el `.pptx` de origen y solo se
> **insertan** láminas nuevas; sobre las originales, como mucho se mete una imagen por
> **debajo** de lo que ya había.

```python
prs = Presentation(ORIGEN)              # se parte del archivo real
s = prs.slides.add_slide(layout)        # add_slide siempre añade al final
...
# reordenar moviendo elementos en la lista de ids
sldIdLst = prs.slides._sldIdLst
originales = list(sldIdLst)
for el in list(sldIdLst):
    sldIdLst.remove(el)
for i, el in enumerate(originales, 1):
    sldIdLst.append(el)
    for nueva in insertadas.get(i, []):
        sldIdLst.append(nueva)
```

Para meter una imagen **detrás** del texto existente (fondos):

```python
pic = slide.shapes.add_picture(ruta, 0, 0, Inches(13.333), Inches(7.5))
spTree = slide.shapes._spTree
spTree.remove(pic._element)
spTree.insert(2, pic._element)   # tras nvGrpSpPr y grpSpPr: al fondo del z-order
```

### Renumeración

Al intercalar, los números de página del original quedan descuadrados. Es el **único**
cambio de texto admisible sobre las originales, y debe declararse. Las láminas nuevas
también necesitan número, o la secuencia salta.

### Verificación de fidelidad

Comparar el XML de cada `ppt/slides/slideN.xml` entre origen y destino. **Trampa
importante:** python-pptx reserializa al guardar y reindenta elementos que no ha tocado
(típicamente `<p:pic>`), así que comparar bytes marca como distintas diapositivas cuyo
contenido es idéntico. Hay que normalizar espacios en blanco insignificantes y el número
de página antes de comparar:

```python
for el in root.iter():
    if el.tag != A + 't':                       # el texto real se respeta
        if el.text is not None and not el.text.strip():
            el.text = None
    if el.tail is not None and not el.tail.strip():
        el.tail = None
```

Resultado esperado: `238 de 238 intactas salvo el número de página`.

---

## 3. Fotografía real desde Wikimedia Commons

### 3.1 La trampa que cuesta dos horas si no se sabe

**La API hace AND con todos los términos.** Una consulta descriptiva de 7-8 palabras
devuelve **cero** resultados; la misma recortada a 3 devuelve 18 con metadatos ricos.

```
"valley fog dissipating in morning sunlight over forested hills"  ->  0 aciertos
"valley fog forest"                                              -> 18 aciertos
```

Y el fallo es **silencioso y engañoso**: si el buscador prueba varias consultas y se queda
con la mejor, las específicas dan cero y solo sobrevive la genérica de respaldo, que
entrega imágenes con buena puntuación técnica y ninguna relación conceptual. Así
aparecieron un teleférico, un volcán y una siembra con dron.

**Solución:** generar variantes por retroceso, de 4, 3 y 2 palabras de contenido, con las
más específicas primero.

```python
def variantes(q):
    ws = [w for w in re.findall(r'[a-z]+', q.lower())
          if len(w) > 3 and w not in STOPWORDS]
    return [' '.join(ws[:k]) for k in (4, 3, 2) if len(ws) >= k]
```

### 3.2 Parámetros de consulta que importan

```python
{'action': 'query', 'generator': 'search',
 'gsrsearch': 'filetype:bitmap ' + consulta,
 'gsrnamespace': '6',
 'prop': 'imageinfo|categories',        # categorías: el mejor material de relevancia
 'cllimit': '60', 'clshow': '!hidden',
 'iiprop': 'url|size|mime|extmetadata',
 'iiurlwidth': '2560'}
```

- **`categories`** es lo más útil para juzgar relevancia: describen el sujeto mejor que el
  título.
- **`extmetadata.LicenseShortName`** da la licencia. Filtrar a dominio público, CC0,
  CC BY y CC BY-SA. Rechazar NC y ND.
- **`iiurlwidth`** entrega una versión redimensionada: evita descargar originales de 40 000 px.

### 3.3 Modos de fallo observados, con ejemplo real

| Modo | Ejemplo que se coló |
|---|---|
| Material de archivo en B/N | Trincheras de Gallipoli 1915 para "quebrada encajonada" |
| Satélite con logo o rótulo incrustado | Copernicus, NOAA, CIRA sobre la imagen |
| Salida de modelo en falso color | Panel multipanel tomado por fotografía |
| Foto de congreso o interior | Ponente ante una diapositiva sobre GOES |
| Objeto literal equivocado | Bandera de Timor por buscar *flag tree* (árbol bandera) |
| Homónimo | **Caballas** por *mackerel sky* (cielo aborregado) |
| Obra de arte | *La noche estrellada* de Van Gogh por *starry night* |

Los filtros por palabra y por categoría reducen esto, **pero no lo eliminan**. Los cuatro
últimos casos pasaron todos los filtros automáticos.

### 3.4 La única puerta que funciona: mirar

Hojas de contacto de 12 imágenes con su número de lámina y su concepto al pie. Es barato
—una hoja por cada 12— y detecta lo que ningún filtro detecta.

En este proyecto: **de 114 fotos, 23 eran fallos duros y 27 flojas en la primera tanda.**
Hicieron falta **tres rondas** de reparación. Presupuestar eso desde el principio.

### 3.5 Puntuación de candidatos

Combinar, en este orden de importancia: relevancia de búsqueda, coincidencia de vocabulario
con la consulta, cercanía a 16:9, resolución, y penalizaciones fuertes (−45 a −60) para
categorías de sujeto artificial, material de archivo y arte. Premiar `jpeg`: las fotos
suelen serlo, los esquemas suelen ser `png`.

---

## 4. Fondos fotográficos sobre láminas de color plano

Para láminas que son **texto sobre un color sólido**, poner una foto detrás funciona muy
bien, pero no en color pleno: el texto deja de leerse y la identidad del deck se pierde.

**Duotono con techo de luminancia.** Se pasa la foto a escala de grises con autocontraste,
y se mapea a un degradado entre una sombra casi negra y un tono alto **elegido**. Fijar el
tono alto fija el contraste máximo contra el texto blanco, que es lo único que garantiza
legibilidad en las 64 láminas sin revisarlas una a una.

```python
PALETA = {'0F2A20': ((7, 15, 12), (62, 101, 82)),      # verde del deck
          'D9531E': ((94, 32, 10), (214, 92, 40))}     # naranja de las PAUSA
```

Consecuencias para elegir la foto, que hay que decirle a quien la busque:

- **Manda la forma y la textura, no el color.** El color se pierde. Sirven siluetas de
  crestas, estructura de nubes, vetas de humo, ondas, estrías, grano de vegetación.
- **Descartar imágenes cuya gracia sea el color** (atardeceres naranjas, arcoíris): en
  duotono se vuelven barro.
- **Descartar imágenes claras y uniformes** (cielo liso, nieve): al oscurecerlas quedan en
  gris plano.
- Buscar una **zona tranquila** donde caiga el texto.

Añadir una viñeta suave y una banda inferior más opaca para el pie de crédito. **Sobre
nube blanca o nieve, un degradado único no basta**: hacen falta dos bandas, una alta y
suave para el título y otra estrecha y fuerte para el crédito.

---

## 5. Diagramas: lo que funciona

### 5.1 NotebookLM produce diagramas 3D excelentes

Contra lo que parecía, **sí genera isométricos de calidad profesional**. Dos cosas hay que
saber:

1. **El `list_types` del MCP omite el parámetro `--style`**, pero el CLI lo expone:
   `auto_select, sketch_note, professional, bento_grid, editorial, instructional, bricks,
   clay, anime, kawaii, scientific`. No dar por ausente una capacidad sin comprobar el CLI.
2. **Lo que dispara el 3D es el `focus`**, no el estilo. Pedir explícitamente profundidad
   isométrica, y **construir el prompt desde el texto real de esa lámina** para que el
   contenido salga fiel.

```python
ESTILO = ("Diagrama isometrico con profundidad y volumen tridimensional, aspecto de "
          "maqueta en capas, fondo oscuro verde petroleo, acentos naranjas, tipografia "
          "sobria, sin personas, en espanol de Chile. Debe verse espectacular proyectado "
          "a pantalla completa en 16:9.")

foco = f"{eyebrow}. {titulo}. Contenido exacto a representar: {texto_de_la_lamina}. {ESTILO}"
```

Reprodujo cifras del deck sin que se le dieran aparte: el ÷1,15, el WAF 0,5, los 216 km/h,
la tabla Terral/Raco/Puelche por región.

### 5.2 Límites reales de NotebookLM

| Límite | Detalle |
|---|---|
| **Cuota** | ~12-15 infografías por cada 12 h, **por cuenta**. Se manifiesta como `RESOURCE_EXHAUSTED` |
| **Límite de ritmo** | El *mismo* error tapa un límite corto que cede en 2-3 min. Esperar 150/300/450 s antes de descartar |
| **Autenticación** | Caduca a menudo. `nlm login` abre Chrome y **requiere una persona**: caducó tres veces a los 300 s |
| **Marca de agua** | "Gemini Notebook" abajo a la derecha |
| **Autoría del texto** | Lo redacta la IA. Fiel a las fuentes, pero **no lo escribió el autor del deck**: exige revisión antes de doctrina oficial |

Por la cuota, un deck con 67 diagramas necesita **4 o 5 sesiones en días distintos**. El
generador debe ser **reanudable**: guardar estado tras cada artefacto y no repetir nada.

### 5.3 Lo que NO funciona: plantillas genéricas

**Este fue el fallo más caro de la sesión.** Se construyeron cinco arquetipos
parametrizables (secuencia, capas, corte, pareado, matriz) y se forzaron 55 diagramas a
través de ellos. Resultado: 55 láminas **peores que el diagrama plano que reemplazaban**.

La causa, precisa:

> La plantilla dibujaba una losa isométrica que **no representaba nada** — ni el terreno,
> ni la parcela de aire, ni la columna. Al no representar nada, todo el contenido tuvo que
> irse a las etiquetas. Se convirtieron dibujos explicativos en **listas de texto con un
> ornamento 3D al lado**.

El original de "viento efectivo" dibuja la suma de vectores sobre la ladera y se entiende
sin leer. La reconstrucción eran dos rombos verdes idénticos con las mismas palabras
puestas en lista.

**La regla que se deriva:**

> Una plantilla solo sirve si **el dibujo carga el significado**. Si todo el contenido
> acaba en las etiquetas, la plantilla es decoración y hay que rechazarla, por muchas que
> ya lleve hechas.

Generar diagramas por código **sí** es viable, pero exige una ilustración a medida por
concepto, no una plantilla compartida. Presupuestar en consecuencia, o usar NotebookLM.

### 5.4 Render por código, si se hace

SVG isométrico + captura con Chrome headless funciona y no tiene cuota:

```bash
chrome --headless --disable-gpu --hide-scrollbars \
       --window-size=2400,1350 --screenshot="salida.png" "file:///ruta/lamina.html"
```

Proyección isométrica y **la trampa de composición**:

```python
sx = (x - y) * cos(30°)
sy = (x + y) * sin(30°) - z
```

Avanzar en `+x` **baja hacia la derecha**. Para alinear elementos en horizontal hay que
desplazarse por `(+d, -d)`, que proyecta sobre `sy = 0`. Y centrar el grupo en el elemento
del medio, no en el primero, o el último se sale del lienzo.

---

## 6. El error de método que hay que evitar por encima de todo

Las 55 láminas malas **sí se revisaron**. Se miraron una a una en hojas de contacto. Y aun
así se entregaron.

**Porque se comprobó la propiedad equivocada.** La pregunta que se hizo fue *"¿está limpio,
se lee, respeta la paleta?"* — y lo estaba. Nunca se hizo la única pregunta que importaba:

> **¿Esta imagen explica mejor que la que va a reemplazar?**

En ningún momento se puso el resultado **al lado del original que debía superar**. Esa
comparación cuesta un comando. Con el primer diagrama habría matado el enfoque.

### La regla

> **Cuando se reemplaza algo que ya existe, el criterio de aceptación es una comparación
> lado a lado contra lo que reemplaza, juzgada por si hace mejor el trabajo — no por si se
> ve ordenado por sí solo. Si no le gana al original, no se entrega.**

Hubo además un aviso desechado: en la propia revisión se anotó que *"el motivo de la losa
se repite"* y que una lámina era *"floja porque la losa no transmite el concepto"*. Se
siguió igual, por el trabajo ya invertido. **Eso es razonar por coste hundido, y es la
señal de alarma más fiable de que hay que parar.**

---

## 7. Auditoría de invariantes: la red que sí atrapa

Un fallo distinto llegó al cliente: **26 diagramas quedaron sin versión mejorada** porque
se clasificaron por superficie —"menos de 21 pulg² = viñeta decorativa"— **sin abrirlos**.
Entre los descartados estaban las tres fuerzas, el ángulo de cruce y las cuatro masas de
aire de Chile. Un umbral en vez de una mirada.

La defensa no es prometer más cuidado, es **un auditor que abre el archivo terminado** y
comprueba invariantes, en vez de confiar en que el código hizo lo que uno creía:

1. Toda lámina original con diagrama tiene su versión mejorada en su sitio.
2. Toda lámina de color plano lleva su fondo.
3. Toda lámina nueva tiene imagen que cubre la diapositiva completa.
4. Ningún texto original perdido, comparando `<a:t>` uno a uno.
5. El total de diapositivas coincide con el esperado.

Dos detalles que lo hacen útil de verdad:

- **Probarlo contra una versión que se sabe defectuosa.** Si no detecta el fallo conocido,
  el auditor no vale. *Una prueba que no se ha visto fallar no es una prueba.*
- **Que declare la cobertura en voz alta**: `12 de 67 (pendientes: 55)`, no un `SÍ/NO`. Un
  pendiente conocido es aceptable; uno invisible es lo que hace perder el tiempo al
  cliente revisando.

---

## 8. Recetas rápidas

### Censo del deck de partida

```python
from pptx import Presentation
from pptx.util import Emu
p = Presentation(ORIGEN)
for i, s in enumerate(p.slides, 1):
    pics = [sh for sh in s.shapes if sh.shape_type == 13]   # 13 = PICTURE
    area = sum(Emu(sh.width).inches * Emu(sh.height).inches for sh in pics)
    bg = s._element.find('.//{...presentationml...}bg')     # color de fondo
```

Clasificar por **fondo** (blanco / color) y por **presencia de imagen**, nunca por tamaño.

### Renderizar a PNG para mirar (Windows, sin LibreOffice)

```powershell
$ppt  = New-Object -ComObject PowerPoint.Application
$pres = $ppt.Presentations.Open($ruta, $true, $false, $false)
$pres.Slides.Item($n).Export($salida, "PNG", 1600, 900)
```

### Hoja de contacto para revisar en bloque

Rejilla de 12 con número de lámina y concepto al pie. Es el instrumento que más fallos
detectó por unidad de esfuerzo en todo el proyecto.

---

## 9. Números de referencia del proyecto

| | |
|---|---|
| Deck original | 238 diapositivas, 13,33 × 7,5 pulgadas, Calibri |
| Paleta | `0F2A20` verde profundo · `D9531E` naranja · `9AA8A1` salvia · `FFFFFF` |
| Reparto de fondos | 174 blancas · 55 verde oscuro · 9 naranja (PAUSA) |
| Láminas con diagrama | 67 |
| Láminas fotográficas añadidas | 114, todas con licencia libre verificada |
| Fondos en duotono | 64 |
| Peso final | ~100-110 MB (supera el límite de adjunto de la mayoría de canales) |
| Rondas de reparación de fotos | 3 |

---

## 10. Checklist antes de entregar

- [ ] El auditor de invariantes pasa **y** se ha probado contra una versión defectuosa.
- [ ] Fidelidad verificada: ningún texto original perdido ni alterado.
- [ ] **Cada elemento que reemplaza a otro se ha comparado lado a lado con su predecesor.**
- [ ] Todas las imágenes nuevas se han mirado renderizadas dentro del PPTX, no solo como archivo suelto.
- [ ] Créditos y licencias exportados a CSV; ninguna licencia NC ni ND.
- [ ] Los pendientes conocidos están **escritos explícitamente** en la entrega.
- [ ] Ortografía revisada: los agentes devuelven texto en español **sin tildes** con
      frecuencia. En este proyecto hubo que corregir 26 títulos.
