# 📦 Aplicación de Gestión de Inventario

Aplicación web completa para gestión de inventario desarrollada con Google Apps Script.

## 🚀 Características

- ✅ **Gestión de Productos** - CRUD completo con códigos EAN
- ✅ **Gestión de Almacenes** - Múltiples ubicaciones
- ✅ **Control de Stock** - Seguimiento en tiempo real
- ✅ **Registro de Movimientos** - Entradas y salidas
- ✅ **Escáner de Códigos de Barras** - Usando la cámara del dispositivo
- ✅ **Búsqueda por EAN** - Lookup automático de información
- ✅ **Alertas de Stock Bajo** - Dashboard con alertas
- ✅ **Diseño Responsivo** - Funciona en móvil y escritorio

## 📋 Instalación

### 1. Crear una nueva hoja de cálculo en Google Sheets

1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja de cálculo
3. Dale un nombre (ej: "Inventario")

### 2. Abrir el Editor de Apps Script

1. En la hoja de cálculo, ve a **Extensiones > Apps Script**
2. Se abrirá el editor de Apps Script

### 3. Copiar los archivos

1. **Elimina** el archivo `Code.gs` que viene por defecto
2. Crea los siguientes archivos haciendo clic en el botón **+** junto a "Archivos":

#### Archivo: Code.gs
- Clic en **+** > **Secuencia de comandos**
- Nómbralo `Code`
- Copia el contenido del archivo `Code.gs` de este proyecto

#### Archivo: index.html
- Clic en **+** > **HTML**
- Nómbralo `index`
- Copia el contenido del archivo `index.html` de este proyecto

#### Archivo: css.html
- Clic en **+** > **HTML**
- Nómbralo `css`
- Copia el contenido del archivo `css.html` de este proyecto

#### Archivo: js.html
- Clic en **+** > **HTML**
- Nómbralo `js`
- Copia el contenido del archivo `js.html` de este proyecto

### 4. Guardar y Desplegar

1. Haz clic en **💾 Guardar proyecto**
2. Ve a **Implementar > Nueva implementación**
3. Selecciona el tipo: **Aplicación web**
4. Configura:
   - **Descripción**: Gestión de Inventario v1.0
   - **Ejecutar como**: Yo
   - **Quién tiene acceso**: Solo yo (o según tus necesidades)
5. Haz clic en **Implementar**
6. **Autoriza** la aplicación cuando se te solicite
7. Copia la **URL de la aplicación web**

### 5. Abrir la Aplicación

1. Abre la URL copiada en tu navegador
2. ¡La aplicación está lista para usar!

## 📱 Uso

### Dashboard
- Visualiza estadísticas generales
- Alertas de stock bajo
- Movimientos del día

### Productos
- **Nuevo Producto**: Clic en "+ Nuevo Producto"
- **Buscar por EAN**: Ingresa el código EAN y haz clic en "🔍 Buscar info" para autocompletar
- **Editar/Eliminar**: Usa los botones en cada fila

### Almacenes
- **Nuevo Almacén**: Clic en "+ Nuevo Almacén"
- Visualiza todos los almacenes en tarjetas

### Stock
- Visualiza el stock actual por producto y almacén
- Filtra por almacén
- **Registrar Movimiento**: Clic en "+ Registrar Movimiento"
  - Selecciona producto y almacén
  - Elige tipo: Entrada o Salida
  - Ingresa cantidad

### Escáner de Códigos
- **Iniciar Escáner**: Permite acceso a la cámara
- Apunta al código de barras
- O ingresa el código manualmente
- Si el producto existe, muestra su información
- Si no existe, permite crearlo rápidamente

## 🔧 Configuración

### Permisos Necesarios
La aplicación requiere los siguientes permisos:
- ✅ Acceso a Google Sheets (para almacenar datos)
- ✅ Acceso a servicios externos (para lookup de EAN)
- ✅ Acceso a la cámara (para escáner de códigos)

### API de Búsqueda EAN
La aplicación usa la API de Open Food Facts para buscar información de productos por EAN.
Esta API es gratuita y no requiere configuración adicional.

## 📊 Estructura de Datos

La aplicación crea automáticamente 4 hojas en tu Google Sheets:

1. **Productos**: Id, Nombre, Descripción, EAN, Categoría, Codigo_Producto, Stock_Minimo
2. **Almacenes**: Id, Nombre, Ubicación
3. **Stock**: Id, Id_Producto, Id_Almacen, Cantidad
4. **Movimientos**: Id, Id_Producto, Id_Almacen, Tipo, Cantidad, Fecha, Observaciones

## 🎨 Personalización

### Cambiar Colores
Edita las variables CSS en `css.html`:
```css
:root {
  --primary: #6366f1;
  --secondary: #8b5cf6;
  --success: #10b981;
  --warning: #f59e0b;
  --danger: #ef4444;
}
```

### Agregar Campos
1. Modifica la función `getSheet()` en `Code.gs` para agregar columnas
2. Actualiza los formularios en `index.html`
3. Actualiza las funciones de guardado en `js.html`

## 🐛 Solución de Problemas

### El escáner no funciona
- Asegúrate de dar permisos de cámara al navegador
- Usa HTTPS (la URL de Google Apps Script ya lo tiene)
- Prueba con diferentes navegadores (Chrome/Safari funcionan mejor)

### Error al cargar datos
- Verifica que las hojas se hayan creado correctamente
- Revisa los permisos de la aplicación
- Mira los logs en Apps Script: Ver > Registros

### La búsqueda por EAN no encuentra nada
- La API de Open Food Facts solo tiene productos alimenticios
- Para otros productos, puedes integrar otras APIs
- O simplemente completa los datos manualmente

## 📝 Notas

- Los IDs se generan automáticamente usando UUID
- Los datos se almacenan en Google Sheets (gratis hasta 5 millones de celdas)
- La aplicación funciona offline una vez cargada (excepto búsqueda EAN)
- Compatible con móviles y tablets

## 🔄 Actualizar la Aplicación

1. Edita los archivos en el editor de Apps Script
2. Guarda los cambios
3. Ve a **Implementar > Administrar implementaciones**
4. Haz clic en el ícono de lápiz ✏️
5. Cambia la versión a "Nueva versión"
6. Haz clic en **Implementar**

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, puedes:
- Revisar los logs en el editor de Apps Script
- Verificar la consola del navegador (F12)
- Asegurarte de que todos los archivos estén correctamente copiados

---

¡Disfruta gestionando tu inventario! 📦✨
