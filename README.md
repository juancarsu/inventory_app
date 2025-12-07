# 📖 Manual de Uso Completo - Gestión de Inventario

Versión 1.0 - Desarrollado por Juan Carlos Suárez
Aplicación web construida con Google Apps Script para la gestión integral de proveedores, empresas y pedidos. Licencia: Creative Commons Reconocimiento (CC BY) creativecommons.org
Puedes usar, copiar, modificar y distribuir este código (sin fines comerciales), siempre que cites a Juan Carlos Suárez como autor original.

Una guía paso a paso para aprovechar todas las funcionalidades de tu sistema de gestión de inventario.

---

## 📑 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Interfaz Principal](#interfaz-principal)
3. [Gestión de Productos](#gestión-de-productos)
4. [Gestión de Almacenes](#gestión-de-almacenes)
5. [Control de Stock](#control-de-stock)
6. [Escáner de Códigos](#escáner-de-códigos)
7. [Configuración del Sistema](#configuración-del-sistema)
8. [Consejos y Buenas Prácticas](#consejos-y-buenas-prácticas)
9. [Preguntas Frecuentes](#preguntas-frecuentes)

---

## 🎯 Introducción

Este manual te guiará a través de todas las características del sistema. Si es tu primera vez, te recomendamos seguir los pasos en orden.

### Acceso a la Aplicación

1. Abre el navegador y ve a la URL de tu aplicación
2. Verás la pantalla de inicio con el Dashboard
3. Usa el menú superior para navegar entre secciones

### Estructura del Menú

```
📦 Gestión de Inventario
├── Dashboard       (Estado actual del sistema)
├── Productos      (Catálogo de productos)
├── Almacenes      (Ubicaciones de almacenamiento)
├── Stock          (Niveles de inventario)
├── Escáner        (Lectura de códigos de barras)
└── Configuración  (Proveedores y categorías)
```

---

## 📊 Interfaz Principal (Dashboard)

El Dashboard es tu panel de control. Muestra todo lo importante de un vistazo.

### Estadísticas Principales

En la parte superior verás 4 tarjetas con información clave:

**📦 Productos**
- Número total de productos en tu catálogo
- Haz clic para ir a la sección de Productos

**🏢 Almacenes**
- Cantidad de almacenes configurados
- Haz clic para gestionar almacenes

**⚠️ Alertas de Stock Bajo**
- Productos que están por debajo del stock mínimo
- Requiere atención inmediata

**📊 Movimientos Hoy**
- Número de entradas/salidas del día actual
- Útil para auditoría diaria

### Alertas de Stock Bajo

Debajo de las estadísticas verás una sección con alertas:

```
PRODUCTO: Marco simple LS 990
Almacén: Almacén Principal
Stock Actual: 2 | Mínimo: 5
```

**Acciones:**
- ✅ Si no hay alertas: "No hay alertas de stock bajo"
- 📌 Toma nota de los productos en alerta
- 🛒 Planifica nuevas compras

### Movimientos Recientes

La tabla inferior muestra los últimos 10 movimientos:

| Fecha/Hora | Producto | Almacén | Tipo | Cantidad | Observaciones |
|------------|----------|---------|------|----------|---------------|
| 07/12/2025 14:30 | Cable 2.5mm | Principal | ENTRADA | 50 | Compra a Elektra |

**Tipos de Movimiento:**
- 📥 **ENTRADA** - Recepción de productos (compra, devolución)
- 📤 **SALIDA** - Despacho de productos (venta, uso)

---

## 📦 Gestión de Productos

Aquí gestionas todo tu catálogo de productos.

### Crear un Nuevo Producto

**Paso 1:** Haz clic en **"+ Nuevo Producto"**

Se abrirá un formulario modal. Verás los siguientes campos:

**Campos Obligatorios:**
- **Nombre** ⭐ - Nombre del producto (ej: "Cable de cobre 2.5mm")

**Campos Recomendados:**
- **Descripción** - Detalles adicionales (ej: "Cable flexible, color rojo")
- **Código EAN** - Código de barras (ej: "8427838346018")
- **Código Proveedor** - ID del proveedor (ej: "CAB-2.5-RED")

**Campos Opcionales:**
- **Proveedor** - Selecciona de la lista (ej: "Elektra")
- **Categoría** - Categoría del producto (ej: "Material Eléctrico")
- **Código Producto (Interno)** - Tu código interno
- **Stock Mínimo** - Cantidad para generar alerta
- **URL Foto** - Enlace a imagen (para futura funcionalidad)

**Paso 2:** Usa la búsqueda inteligente

Si tienes un código EAN o de proveedor, haz clic en **"🔍 Buscar por cualquier código"**:

```
1. Ingresa un código en cualquiera de los campos:
   - Código EAN (ej: 8427838346018)
   - Código Proveedor (ej: CAB-2.5)
   - Código Producto (ej: PROD-001)

2. Haz clic en "Buscar"

3. El sistema buscará en:
   ✓ Tu base de datos local (rápido)
   ✓ APIs externas si no encuentra (más lento)

4. Se rellenará automáticamente con:
   - Nombre
   - Descripción
   - Categoría
   - Marca/Proveedor
```

**Paso 3:** Selecciona Proveedor y Categoría

- **Proveedor**: Dropdown con opciones existentes
- **Categoría**: Dropdown con opciones existentes
- Si necesitas un nuevo valor, ve a **Configuración** primero

**Paso 4:** Guarda el producto

- Haz clic en **"Guardar"**
- Se te mostrará un mensaje de confirmación
- El producto aparecerá en la tabla

### Editar un Producto

**Paso 1:** En la tabla de Productos, encuentra el producto

**Paso 2:** Haz clic en **"Editar"** en esa fila

**Paso 3:** Se abrirá el formulario con los datos actuales

**Paso 4:** Modifica los campos necesarios

**Paso 5:** Haz clic en **"Guardar"**

⚠️ **Nota:** Cambiar el EAN o código de proveedor puede afectar búsquedas futuras.

### Buscar Productos

Usa la barra de búsqueda en la parte superior de la tabla:

```
🔍 Buscar por nombre, EAN o categoría...
```

**Ejemplos:**
- "Cable" - Encuentra todos los productos con "cable" en el nombre
- "8427838346018" - Busca por EAN exacto
- "Fontanería" - Encuentra toda la categoría
- "Elektra" - Encuentra productos de ese proveedor

La búsqueda es en tiempo real mientras escribes.

### Generar Código de Barras

Útil para imprimir etiquetas:

**Paso 1:** Encuentra el producto en la tabla

**Paso 2:** Haz clic en **"📊 Código"**

**Paso 3:** Se abrirá un modal mostrando:
- El código de barras (formato automático: EAN13, EAN8, CODE128)
- El número del código debajo

**Paso 4:** Opciones:
- **Descargar PNG** - Descarga la imagen para imprimir
- **Cerrar** - Cierra el modal

**Formato automático:**
- EAN-13 (13 dígitos) → Formato EAN13
- EAN-8 (8 dígitos) → Formato EAN8
- Otros → Formato CODE128

### Eliminar un Producto

⚠️ **CUIDADO:** Esta acción es irreversible

**Paso 1:** Encuentra el producto en la tabla

**Paso 2:** Haz clic en **"Eliminar"**

**Paso 3:** Se pedirá confirmación

**Paso 4:** Confirma si estás seguro

**Recomendación:** Antes de eliminar, verifica que el producto no tenga stock activo.

### Importar Productos Masivamente

Perfecta para cargar catálogos completos desde un archivo.

**Paso 1:** Haz clic en **"📥 Importar CSV/Excel"**

**Paso 2:** Se abrirá un modal con instrucciones

**Paso 3:** Descarga la plantilla de ejemplo

Haz clic en "Descargar plantilla CSV de ejemplo"

El archivo contendrá:
```
Nombre,Descripcion,EAN,Codigo_Proveedor,Proveedor,Categoria,Codigo_Producto,Stock_Minimo
Marco simple LS 990,Marco simple blanco,4011377114609,LS 981 WW,JUNG,Material Eléctrico,JUNG-001,5
Grifo temporizado,Grifo temporizado PRESTO,8427838346018,PRES-123,PRESTO,Fontanería,PRESTO-001,3
```

**Paso 4:** Rellena el archivo

- Columna obligatoria: **Nombre**
- Columnas opcionales: Las demás
- Una fila por producto
- Guarda como CSV (.csv)

**Paso 5:** Sube el archivo

- Haz clic en "Seleccionar archivo CSV"
- Elige tu archivo local

**Paso 6:** Haz clic en **"Importar"**

**Paso 7:** Revisa los resultados

El sistema mostrará:
- ✅ Productos creados: Nuevos productos agregados
- ✅ Productos actualizados: Productos existentes modificados
- ⚠️ Errores: Productos que no se pudieron procesar
- ℹ️ Avisos: Filas vacías omitidas

**Detección de Duplicados:**
El sistema identifica duplicados por:
1. **EAN** exacto
2. **Código Proveedor** (case-insensitive)
3. **Código Producto** (case-insensitive)

Si encuentra un duplicado, **actualiza el producto existente** en lugar de crear uno nuevo.

---

## 🏢 Gestión de Almacenes

Define tus ubicaciones de almacenamiento.

### Crear un Almacén

**Paso 1:** Haz clic en **"+ Nuevo Almacén"**

**Paso 2:** Completa el formulario:
- **Nombre** ⭐ (ej: "Almacén Principal", "Sucursal Centro")
- **Ubicación** (ej: "Calle Principal 123, Piso 3")

**Paso 3:** Haz clic en **"Guardar"**

El almacén aparecerá como una tarjeta en la pantalla.

### Visualizar Almacenes

Los almacenes se muestran como tarjetas con:
- 🏢 Nombre del almacén
- 📍 Ubicación
- Botones para Editar y Eliminar

### Ver Detalles de un Almacén

**Paso 1:** Haz clic sobre la tarjeta del almacén

Se abrirá un modal detallado mostrando:

**Estadísticas Resumidas:**
- 📦 Total de productos diferentes
- 📊 Total de unidades en stock
- ⚠️ Productos con stock bajo

**Inventario Organizado por Categoría:**

Cada categoría muestra:
```
📂 Material Eléctrico (5 productos)

Marco simple LS 990
EAN: 4011377114609
Cantidad: 2 unidades [⚠️ Bajo]
[Gráfico de barras de stock]

Cable 2.5mm
EAN: 8427838346018
Cantidad: 150 unidades [✅ OK]
[Gráfico de barras de stock]
```

**Colores del Estado:**
- 🟢 **Verde (OK)** - Stock normal
- 🟡 **Ámbar (Bajo)** - Entre stock mín. y 150% del mín.
- 🔴 **Rojo (Crítico)** - Igual o menor al stock mínimo

### Editar un Almacén

**Paso 1:** En la tarjeta del almacén, haz clic en **"Editar"**

**Paso 2:** Modifica nombre o ubicación

**Paso 3:** Haz clic en **"Guardar"**

### Eliminar un Almacén

⚠️ **CUIDADO:** Primero asegúrate que está vacío

**Paso 1:** En la tarjeta, haz clic en **"Eliminar"**

**Paso 2:** Confirma la acción

---

## 📊 Control de Stock

Visualiza y gestiona los niveles de inventario.

### Entender la Vista de Stock

La tabla muestra todos los productos con su stock en cada almacén:

| Producto | EAN | Almacén | Cantidad | Stock Mín. | Estado |
|----------|-----|---------|----------|-----------|--------|
| Cable 2.5mm | 8427838346018 | Principal | 150 | 10 | ✅ OK |
| Marco LS 990 | 4011377114609 | Principal | 2 | 5 | 🔴 Crítico |

### Filtrar por Almacén

**Paso 1:** Usa el dropdown: "Todos los almacenes"

**Paso 2:** Selecciona un almacén específico

**Paso 3:** La tabla se actualiza automáticamente

Esto es útil para:
- Audit de un almacén específico
- Planificar reposición
- Buscar productos en una ubicación

### Registrar un Movimiento

**Paso 1:** Haz clic en **"+ Registrar Movimiento"**

Se abrirá el formulario:

**Paso 2:** Selecciona el **Producto** ⭐

- Dropdown con todos tus productos
- Escribe para filtrar

**Paso 3:** Selecciona el **Almacén** ⭐

- Dropdown con tus almacenes
- El sistema crea el registro de stock si no existe

**Paso 4:** Elige el **Tipo** ⭐

```
📥 ENTRADA (recibir productos)
   - Compra a proveedor
   - Devolución de cliente
   - Ajuste de inventario (aumento)
   - Transferencia de entrada

📤 SALIDA (despachar productos)
   - Venta a cliente
   - Uso en proyectos
   - Daño/Pérdida
   - Transferencia de salida
```

**Paso 5:** Ingresa la **Cantidad** ⭐

- Número de unidades
- Mínimo 1
- Máximo sin límite

**Paso 6:** Agrega **Observaciones** (opcional)

Ejemplos:
```
"Compra a Elektra. Factura #12345"
"Venta a Cliente XYZ. Remisión #678"
"Devolución de mercancía defectuosa"
"Ajuste por auditoría física"
"Transferencia de almacén principal a sucursal"
```

**Paso 7:** Haz clic en **"Registrar"**

⚡ **Lo que sucede automáticamente:**
1. Se crea un registro de movimiento
2. El stock se actualiza en tiempo real
3. Se genera timestamp automático
4. Se muestra en el Dashboard

### Entender los Estados de Stock

**Color Verde (OK)**
- Stock > Stock Mínimo × 1.5
- Todo en orden, sin urgencia

**Color Ámbar (Bajo)**
- Stock ≤ Stock Mínimo × 1.5
- Pero > Stock Mínimo
- Pronto se acabará, planifica compra

**Color Rojo (Crítico)**
- Stock ≤ Stock Mínimo
- Compra urgente necesaria
- Considera pausar ventas

---

## 📱 Escáner de Códigos

Lee códigos de barras directamente desde tu dispositivo.

### Requisitos Previos

- ✅ Navegador moderno (Chrome, Safari, Firefox)
- ✅ Dispositivo con cámara (smartphone, tablet, laptop)
- ✅ Conexión HTTPS (Google Apps Script proporciona esto)
- ✅ Autorización de acceso a cámara en el navegador

### Iniciar el Escáner

**Paso 1:** Ve a la pestaña **"Escáner"**

**Paso 2:** Haz clic en **"Iniciar Escáner"**

**Paso 3:** El navegador pedirá permiso para acceder a la cámara

- Haz clic en **"Permitir"**
- Si no aparece el aviso, revisa la barra de direcciones

**Paso 4:** Verás un cuadrado en la pantalla

Este es el área de detección. El código debe estar dentro.

### Escanear un Código

**Paso 1:** Apunta la cámara al código de barras

**Paso 2:** El código debe estar:
- Dentro del cuadrado de detección
- Bien iluminado (no en sombra)
- Recto (no girado)
- A distancia legible (3-20 cm típicamente)

**Paso 3:** El sistema lee automáticamente

No es necesario hacer clic. Cuando detecte el código:
- 📥 Se detiene la cámara
- Se mostrará el resultado

### Resultado del Escaneo

**Si el producto existe:**

```
✅ PRODUCTO ENCONTRADO

Nombre: Cable de cobre 2.5mm
EAN: 8427838346018
Categoría: Material Eléctrico
Código: CAB-2.5

Coincidencia: Exacta (EAN)

Stock:
- Almacén Principal: 150 unidades
- Sucursal Centro: 45 unidades

[Botón: Registrar Movimiento]
```

**Si el producto NO existe:**

```
❌ PRODUCTO NO ENCONTRADO

No se encontró ningún producto con el código: 8427838346018

[Botón: Crear Nuevo Producto]
```

### Entrada Manual

Si prefieres no usar la cámara:

**Paso 1:** Usa el campo: "O ingresa el código..."

**Paso 2:** Escribe el código manualmente

**Paso 3:** Haz clic en **"Buscar"**

Formatos aceptados:
- EAN-13: 8427838346018
- EAN-8: 96385074
- Código proveedor: CAB-2.5
- Código interno: PROD-001

### Acciones Rápidas desde Escaneo

#### Registrar Movimiento
Desde la pantalla de producto encontrado:

**Paso 1:** Haz clic en **"Registrar Movimiento"**

**Paso 2:** Se abrirá el formulario con el producto preseleccionado

**Paso 3:** Solo elige almacén, tipo, cantidad y guarda

#### Crear Nuevo Producto
Si el código no existe:

**Paso 1:** Haz clic en **"Crear Nuevo Producto"**

**Paso 2:** Se abrirá el formulario con el código prellenado

**Paso 3:** Completa nombre y otros campos

**Paso 4:** Guarda

### Solucionar Problemas del Escáner

**"No funciona la cámara"**
- Autoriza el acceso en el navegador
- Prueba con Chrome o Safari
- Reinicia la página

**"No detecta el código"**
- Mejora la iluminación
- Acércate más o aléjate un poco
- Asegúrate que esté dentro del cuadrado

**"Código incorrecto"**
- Algunos códigos tienen caracteres especiales
- Intenta ingresarlo manualmente
- Verifica el formato

---

## ⚙️ Configuración del Sistema

Personaliza proveedores y categorías.

### Acceder a Configuración

**Paso 1:** Haz clic en **"⚙️ Configuración"** en el menú superior

Verás dos secciones: Proveedores y Categorías

### Gestionar Proveedores

**Crear Proveedor:**

**Paso 1:** Haz clic en **"+ Añadir Proveedor"**

**Paso 2:** Ingresa el nombre (ej: "Elektra", "Saltoki", "Wurth")

**Paso 3:** Haz clic en **"Guardar"**

El proveedor aparecerá en la lista y estará disponible en:
- Formularios de productos
- Filtros de búsqueda

**Eliminar Proveedor:**

**Paso 1:** Encuentra el proveedor en la lista

**Paso 2:** Haz clic en **"Eliminar"**

**Paso 3:** Confirma

⚠️ **Nota:** Solo elimina si no hay productos asignados.

### Gestionar Categorías

**Crear Categoría:**

**Paso 1:** Haz clic en **"+ Añadir Categoría"**

**Paso 2:** Ingresa el nombre (ej: "Material Eléctrico", "Fontanería")

**Paso 3:** Haz clic en **"Guardar"**

**Estructura Recomendada:**
```
Material Eléctrico
├── Cableado
├── Interruptores
└── Cuadros de distribución

Fontanería
├── Tuberías
├── Accesorios
└── Grifería

Herramientas
├── Manual
└── Eléctrica

Repuestos
```

**Eliminar Categoría:**

**Paso 1:** Encuentra la categoría

**Paso 2:** Haz clic en **"Eliminar"**

**Paso 3:** Confirma

---

## 💡 Consejos y Buenas Prácticas

### Para Máxima Eficiencia

**1. Setup Inicial**
- ✅ Configura todos tus proveedores primero
- ✅ Organiza tus categorías
- ✅ Crea todos tus almacenes
- ✅ Importa tu catálogo existente en lote

**2. Mantén Datos Limpios**
- ✅ Usa nombres consistentes
- ✅ Completa EAN cuando sea posible
- ✅ Asigna categorías a todos los productos
- ✅ Establece stock mínimos realistas

**3. Rutina Diaria**
```
Mañana:
□ Revisar Dashboard → Alertas
□ Registrar movimientos de la noche anterior
□ Planificar compras si hay alertas

Medio día:
□ Registrar ventas/usos

Tarde:
□ Actualizar stock manual si es necesario
□ Revisar movimientos del día

Viernes:
□ Hacer audit físico
□ Comparar con datos del sistema
□ Ajustar si hay diferencias
```

**4. Seguridad de Datos**
- ✅ Google Sheets respaldo automático
- ✅ Verifica permisos de acceso
- ✅ Solo comparte con personal autorizado
- ✅ Haz backup manual mensual (Descargar > CSV)

**5. Optimización**
- ✅ Agrupa movimientos similares
- ✅ Usa observaciones para auditoría
- ✅ Revisa reportes regularmente
- ✅ Ajusta stock mínimos según demanda

### Escenarios Comunes

**Recepción de Compra**
```
Paso 1: Escanea o busca cada producto
Paso 2: Haz clic "Registrar Movimiento"
Paso 3: Tipo: ENTRADA
Paso 4: Cantidad: La que recibiste
Paso 5: Observación: "Factura #12345. Proveedor: Elektra"
```

**Salida de Producto (Venta)**
```
Paso 1: Busca el producto
Paso 2: "Registrar Movimiento"
Paso 3: Tipo: SALIDA
Paso 4: Cantidad: La vendida
Paso 5: Observación: "Venta a XYZ. Remisión #678"
```

**Transferencia entre Almacenes**
```
Paso 1: Almacén Origen → SALIDA
        Producto: Cable 2.5mm
        Cantidad: 50
        Observación: "Transferencia a Sucursal Centro"

Paso 2: Almacén Destino → ENTRADA
        Producto: Cable 2.5mm
        Cantidad: 50
        Observación: "Recibido desde Almacén Principal"
```

**Ajuste por Auditoría**
```
Si encuentras diferencia:
Cantidad en sistema: 100
Cantidad física contada: 95
Diferencia: -5 unidades

Paso 1: SALIDA de 5 unidades
Paso 2: Observación: "Ajuste auditoría física. Diferencia de 5 unidades"
Paso 3: Guarda

Nota: Investiga por qué falta stock
```

---

## ❓ Preguntas Frecuentes

### Sobre Productos

**P: ¿Qué pasa si duplico un producto?**
R: Si importas desde CSV, el sistema detecta duplicados por EAN o código de proveedor y actualiza el existente en lugar de crear uno nuevo.

**P: ¿Puedo editar solo algunos campos?**
R: Sí, edita solo lo necesario. Los campos vacíos se conservan.

**P: ¿Cómo busco productos rápidamente?**
R: Usa la barra de búsqueda. Busca por nombre, EAN, categoría o proveedor.

**P: ¿Qué hago si no tengo código EAN?**
R: Usa código de proveedor o código interno. El sistema busca en los tres.

### Sobre Stock

**P: ¿Cómo veo el stock total de un producto en todos los almacenes?**
R: Ve a Productos, busca el producto. Para más detalle, crea en cada almacén un movimiento.

**P: ¿Puedo tener stock negativo?**
R: No. El sistema no permite stock negativo. Si intentas una salida mayor que el stock, la cantidad se ajusta a 0.

**P: ¿Cómo corrijo un movimiento erróneo?**
R: Registra el movimiento inverso. Si registraste +10 por error, registra -10.

**P: ¿Cuál es el stock mínimo ideal?**
R: Depende de:
- Frecuencia de consumo
- Tiempo de reabastecimiento
- Espacio disponible
- Presupuesto

Ejemplo:
```
Cable de uso diario (50 por semana)
Tiempo compra: 1 semana
Stock mín recomendado: 50 × 2 = 100
```

### Sobre Escáner

**P: ¿El escáner funciona en todo tipo de código?**
R: Lee códigos EAN-13, EAN-8 y CODE128. Si está dañado o no es legible, ingresa manualmente.

**P: ¿Necesito conexión a internet?**
R: Sí, para acceder a la aplicación. La búsqueda de EAN también requiere internet.

**P: ¿Puedo usar en mi smartphone?**
R: Sí. Accede a la URL desde el navegador del teléfono.

### Sobre Datos y Seguridad

**P: ¿Dónde se guardan los datos?**
R: En Google Sheets. Google proporciona el almacenamiento seguro.

**P: ¿Puedo compartir con mi equipo?**
R: Sí. Comparte el Sheets con los permisos que necesites (solo lectura, edición, etc.).

**P: ¿Cómo hago backup?**
R: En Google Sheets:
1. Archivo > Descargar > CSV
2. Guarda en tu computadora
3. Repite mensualmente

**P: ¿Cuál es el límite de productos?**
R: Google Sheets permite 5 millones de celdas. Con 10 columnas, podrías tener ~500,000 productos.

### Sobre Búsqueda de EAN

**P: ¿Cómo funciona la búsqueda de EAN?**
R: Busca en este orden:
1. Tu base de datos local (instantáneo)
2. UPCitemdb (para productos industriales)
3. Open EAN Database (cobertura universal)
4. EAN-Search.org (base de datos global)
5. Open Food Facts (para alimentos)

**P: ¿Por qué no encuentra un producto?**
R: Las bases de datos externas no tienen todo. Especialmente:
- Productos muy nuevos
- Productos muy antiguos
- Productos locales/regionales
- Productos sin código oficial

**P: ¿Hay límite de búsquedas?**
R: Cada API tiene límites (~100/día), pero generalmente suficiente. Si usas mucho, espera 24h.

---

## 🎓 Próximas Sesiones de Aprendizaje

**Sesión 1: Configuración Básica**
- Crear almacenes
- Agregar proveedores y categorías
- Importar catálogo inicial

**Sesión 2: Operación Diaria**
- Registrar movimientos
- Usar el escáner
- Revisar alertas

**Sesión 3: Análisis y Ajustes**
- Interpretar reportes
- Identificar patrones
- Optimizar stock mínimos

---

## 📞 Soporte

Si encuentras problemas:

1. **Revisa esta guía** - Muchas respuestas aquí
2. **Consulta las FAQs** - Sección anterior
3. **Revisa los logs** - En Apps Script > Ver > Registros
4. **Contacta soporte** - Si el problema persiste

---

**¡Ahora estás listo para dominar tu inventario! 🚀**

Última actualización: Diciembre 2025
Versión: 1.0
