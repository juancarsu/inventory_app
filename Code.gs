function doGet() {
  return HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setTitle('Gestión de Inventario')
      .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

/**
 * Creates custom menu when spreadsheet opens
 * Runs automatically on spreadsheet open
 */
function onOpen() {
  const ui = SpreadsheetApp.getUi();
  ui.createMenu('📦 Gestión de Inventario')
      .addItem('📊 Abrir Dashboard', 'openDashboard')
      .addSeparator()
      .addItem('ℹ️ Acerca de', 'showAbout')
      .addToUi();
}

/**
 * Opens the Dashboard in a modal dialog
 */
function openDashboard() {
  const html = HtmlService.createTemplateFromFile('index')
      .evaluate()
      .setWidth(1200)
      .setHeight(800);
  SpreadsheetApp.getUi().showModalDialog(html, '📦 Gestión de Inventario - Dashboard');
}

/**
 * Shows information about the application
 */
function showAbout() {
  const ui = SpreadsheetApp.getUi();
  ui.alert(
    '📦 Gestión de Inventario',
    'Sistema de gestión de inventario Obras y Mantenimiento.\n\n' +
    'Características:\n' +
    '• Gestión de productos y almacenes\n' +
    '• Control de stock en tiempo real\n' +
    '• Escáner de códigos de barras y QR\n' +
    '• Alertas de stock bajo\n' +
    '• Importación masiva de productos\n\n' +
    'Versión 1.0',
    ui.ButtonSet.OK
  );
}

// Database Configuration
const SHEETS = {
  PRODUCTOS: 'Productos',
  ALMACENES: 'Almacenes',
  STOCK: 'Stock',
  MOVIMIENTOS: 'Movimientos',
  CONFIGURACION: 'Configuracion'
};

function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  
  if (!sheet) {
    sheet = ss.insertSheet(name);
  }
  
  // Check if headers need to be added (if empty)
  if (sheet.getLastRow() === 0) {
    if (name === SHEETS.PRODUCTOS) {
      sheet.appendRow(['Id_Producto', 'Nombre', 'Descripcion', 'EAN', 'Codigo_Proveedor', 'Proveedor', 'Categoria', 'Codigo_Producto', 'Stock_Minimo', 'URL_Foto']);
    } else if (name === SHEETS.ALMACENES) {
      sheet.appendRow(['Id_Almacen', 'Nombre', 'Ubicacion']);
    } else if (name === SHEETS.STOCK) {
      sheet.appendRow(['Id_Stock', 'Id_Producto', 'Id_Almacen', 'Cantidad']);
    } else if (name === SHEETS.MOVIMIENTOS) {
      sheet.appendRow(['Id_Movimiento', 'Id_Producto', 'Id_Almacen', 'Tipo', 'Cantidad', 'Fecha', 'Observaciones']);
    }
  }
  return sheet;
}

// --- Generic CRUD Operations ---
function getData(sheetName) {
  try {
    const sheet = getSheet(sheetName);
    if (sheet.getLastRow() < 2) return []; // Only headers or empty
    
    const data = sheet.getDataRange().getValues();
    const headers = data.shift(); // Remove headers
    
    // Convert to array of objects
    const result = data.map(row => {
      let obj = {};
      headers.forEach((header, i) => {
        obj[header] = row[i];
      });
      return obj;
    });

    return result;
  } catch (e) {
    console.error('Error in getData: ' + e.toString());
    throw new Error('Error en el servidor al obtener datos: ' + e.toString());
  }
}

function saveRecord(sheetName, formObject) {
  const sheet = getSheet(sheetName);
  const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  const data = sheet.getDataRange().getValues();
  
  let idField = '';
  if (sheetName === SHEETS.PRODUCTOS) idField = 'Id_Producto';
  else if (sheetName === SHEETS.ALMACENES) idField = 'Id_Almacen';
  else if (sheetName === SHEETS.STOCK) idField = 'Id_Stock';
  else if (sheetName === SHEETS.MOVIMIENTOS) idField = 'Id_Movimiento';
  
  // Generate ID if new
  let id = formObject[idField];
  let isNew = false;
  
  if (!id) {
    id = Utilities.getUuid();
    formObject[idField] = id;
    isNew = true;
  }
  
  // Map form data to row array based on headers
  const row = headers.map(header => formObject[header] || '');
  
  if (isNew) {
    sheet.appendRow(row);
  } else {
    // Update existing
    let rowIndex = -1;
    for (let i = 1; i < data.length; i++) { // Start at 1 to skip header
      const idColIndex = headers.indexOf(idField);
      if (data[i][idColIndex] == id) {
        rowIndex = i + 1; // 1-based index
        break;
      }
    }
    
    if (rowIndex > 0) {
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
    } else {
      sheet.appendRow(row);
    }
  }
  
  return { success: true, id: id };
}

function deleteRecord(sheetName, id) {
  const sheet = getSheet(sheetName);
  const data = sheet.getDataRange().getValues();
  
  let idField = '';
  if (sheetName === SHEETS.PRODUCTOS) idField = 'Id_Producto';
  else if (sheetName === SHEETS.ALMACENES) idField = 'Id_Almacen';
  else if (sheetName === SHEETS.STOCK) idField = 'Id_Stock';
  else if (sheetName === SHEETS.MOVIMIENTOS) idField = 'Id_Movimiento';
  
  const headers = data[0];
  const idColIndex = headers.indexOf(idField);
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idColIndex] == id) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  return { success: false, message: 'Record not found' };
}

// --- Specialized Functions ---

function getAllData() {
  try {
    return {
      productos: getData(SHEETS.PRODUCTOS),
      almacenes: getData(SHEETS.ALMACENES),
      stock: getData(SHEETS.STOCK),
      movimientos: getData(SHEETS.MOVIMIENTOS),
      config: getAllConfig()
    };
  } catch (e) {
    console.error('Error in getAllData: ' + e.toString());
    throw new Error('Error al obtener todos los datos: ' + e.toString());
  }
}

function getStockByWarehouse(idAlmacen) {
  const stockData = getData(SHEETS.STOCK);
  const productos = getData(SHEETS.PRODUCTOS);
  
  const warehouseStock = stockData.filter(s => s.Id_Almacen == idAlmacen);
  
  // Enrich with product information
  return warehouseStock.map(stock => {
    const producto = productos.find(p => p.Id_Producto == stock.Id_Producto);
    return {
      ...stock,
      NombreProducto: producto ? producto.Nombre : 'Desconocido',
      EAN: producto ? producto.EAN : '',
      Stock_Minimo: producto ? producto.Stock_Minimo : 0
    };
  });
}

function getStockByProduct(idProducto) {
  const stockData = getData(SHEETS.STOCK);
  const almacenes = getData(SHEETS.ALMACENES);
  
  const productStock = stockData.filter(s => s.Id_Producto == idProducto);
  
  // Enrich with warehouse information
  return productStock.map(stock => {
    const almacen = almacenes.find(a => a.Id_Almacen == stock.Id_Almacen);
    return {
      ...stock,
      NombreAlmacen: almacen ? almacen.Nombre : 'Desconocido',
      Ubicacion: almacen ? almacen.Ubicacion : ''
    };
  });
}

function recordMovement(movementData) {
  // Save movement record
  const movementResult = saveRecord(SHEETS.MOVIMIENTOS, {
    Id_Producto: movementData.Id_Producto,
    Id_Almacen: movementData.Id_Almacen,
    Tipo: movementData.Tipo, // 'ENTRADA' or 'SALIDA'
    Cantidad: movementData.Cantidad,
    Fecha: new Date().toISOString(),
    Observaciones: movementData.Observaciones || ''
  });
  
  // Update stock
  const stockSheet = getSheet(SHEETS.STOCK);
  const stockData = stockSheet.getDataRange().getValues();
  const headers = stockData[0];
  
  let stockFound = false;
  for (let i = 1; i < stockData.length; i++) {
    if (stockData[i][1] == movementData.Id_Producto && stockData[i][2] == movementData.Id_Almacen) {
      // Update existing stock
      const currentQty = stockData[i][3] || 0;
      const newQty = movementData.Tipo === 'ENTRADA' 
        ? currentQty + parseInt(movementData.Cantidad)
        : currentQty - parseInt(movementData.Cantidad);
      
      stockSheet.getRange(i + 1, 4).setValue(Math.max(0, newQty));
      stockFound = true;
      break;
    }
  }
  
  // If stock record doesn't exist, create it
  if (!stockFound && movementData.Tipo === 'ENTRADA') {
    saveRecord(SHEETS.STOCK, {
      Id_Producto: movementData.Id_Producto,
      Id_Almacen: movementData.Id_Almacen,
      Cantidad: movementData.Cantidad
    });
  }
  
  return { success: true, movementId: movementResult.id };
}

function getLowStockAlerts() {
  const productos = getData(SHEETS.PRODUCTOS);
  const stockData = getData(SHEETS.STOCK);
  const almacenes = getData(SHEETS.ALMACENES);
  
  const alerts = [];
  
  productos.forEach(producto => {
    const stockMinimo = producto.Stock_Minimo || 0;
    
    // Get total stock for this product across all warehouses
    const productStocks = stockData.filter(s => s.Id_Producto == producto.Id_Producto);
    
    productStocks.forEach(stock => {
      if (stock.Cantidad <= stockMinimo) {
        const almacen = almacenes.find(a => a.Id_Almacen == stock.Id_Almacen);
        alerts.push({
          Producto: producto.Nombre,
          EAN: producto.EAN,
          Almacen: almacen ? almacen.Nombre : 'Desconocido',
          CantidadActual: stock.Cantidad,
          StockMinimo: stockMinimo
        });
      }
    });
  });
  
  return alerts;
}

/**
 * Universal product lookup - LOCAL FIRST, then external APIs
 * Searches by EAN, Supplier Code, or Internal Code
 */
function lookupProduct(code) {
  if (!code) return { found: false, error: 'No code provided' };
  
  Logger.log('Looking up product with code: ' + code);
  
  // STEP 1: Search in LOCAL DATABASE FIRST
  const localResult = searchProductByCode(code);
  if (localResult) {
    Logger.log('Found in local database');
    return localResult;
  }
  
  // STEP 2: If not found locally, try EXTERNAL APIs
  Logger.log('Not found locally, trying external APIs...');
  
  const fetchOptions = {
    muteHttpExceptions: true,
    timeout: 5 // 5 seconds timeout per API
  };
  
  // SOURCE 1: UPCitemdb (Free tier - 100 requests/day)
  // Good coverage for industrial products, no API key required
  try {
    Logger.log('Trying UPCitemdb for code: ' + code);
    const url1 = 'https://api.upcitemdb.com/prod/trial/lookup?upc=' + code;
    const response1 = UrlFetchApp.fetch(url1, fetchOptions);
    
    if (response1.getResponseCode() === 200) {
      const data = JSON.parse(response1.getContentText());
      
      if (data && data.items && data.items.length > 0) {
        const item = data.items[0];
        Logger.log('Found in UPCitemdb');
        return {
          found: true,
          source: 'UPCitemdb',
          nombre: item.title || item.brand || '',
          descripcion: item.description || item.title || '',
          categoria: item.category || '',
          marca: item.brand || ''
        };
      }
    }
  } catch (e) {
    Logger.log('UPCitemdb error: ' + e.toString());
  }
  
  // SOURCE 2: Open EAN Database (opengtindb.org)
  // Universal coverage, no limits, all product types
  try {
    Logger.log('Trying Open EAN Database for code: ' + code);
    const url2 = 'https://opengtindb.org/?ean=' + code + '&cmd=json';
    const response2 = UrlFetchApp.fetch(url2, fetchOptions);
    
    if (response2.getResponseCode() === 200) {
      const data = JSON.parse(response2.getContentText());
      
      if (data && data.name && data.error !== 'EAN Not found') {
        Logger.log('Found in Open EAN Database');
        return {
          found: true,
          source: 'Open EAN Database',
          nombre: data.name || '',
          descripcion: data.detailname || data.name || '',
          categoria: data.categoryname || '',
          marca: data.vendor || ''
        };
      }
    }
  } catch (e) {
    Logger.log('Open EAN Database error: ' + e.toString());
  }
  
  // SOURCE 3: EAN-Search.org
  // Global database, generous limits
  try {
    Logger.log('Trying EAN-Search.org for code: ' + code);
    const url3 = 'https://api.ean-search.org/api?op=barcode-lookup&ean=' + code + '&format=json';
    const response3 = UrlFetchApp.fetch(url3, fetchOptions);
    
    if (response3.getResponseCode() === 200) {
      const data = JSON.parse(response3.getContentText());
      
      if (data && data.length > 0 && data[0].name) {
        const product = data[0];
        Logger.log('Found in EAN-Search.org');
        return {
          found: true,
          source: 'EAN-Search.org',
          nombre: product.name || '',
          descripcion: product.name || '',
          categoria: product.categoryName || '',
          marca: product.manufacturer || ''
        };
      }
    }
  } catch (e) {
    Logger.log('EAN-Search.org error: ' + e.toString());
  }
  
  // SOURCE 4: Open Food Facts (fallback for food products)
  // Original API, works well for food items
  try {
    Logger.log('Trying Open Food Facts for code: ' + code);
    const url4 = 'https://world.openfoodfacts.org/api/v0/product/' + code + '.json';
    const response4 = UrlFetchApp.fetch(url4, fetchOptions);
    
    if (response4.getResponseCode() === 200) {
      const data = JSON.parse(response4.getContentText());
      
      if (data.status === 1 && data.product && data.product.product_name) {
        Logger.log('Found in Open Food Facts');
        return {
          found: true,
          source: 'Open Food Facts',
          nombre: data.product.product_name || '',
          descripcion: data.product.generic_name || data.product.product_name || '',
          categoria: data.product.categories || '',
          marca: data.product.brands || ''
        };
      }
    }
  } catch (e) {
    Logger.log('Open Food Facts error: ' + e.toString());
  }
  
  // No source found the product
  Logger.log('Product not found in any source: ' + code);
  return { 
    found: false, 
    message: 'No se encontró información para este código en ninguna base de datos'
  };
}

// Keep old function name for backward compatibility
function lookupEAN(ean) {
  return lookupProduct(ean);
}

function searchProductByEAN(ean) {
  const productos = getData(SHEETS.PRODUCTOS);
  return productos.find(p => p.EAN == ean) || null;
}

/**
 * Normalize a product code for flexible matching
 * Removes spaces, hyphens, and leading zeros
 */
function normalizeCode(code) {
  if (!code) return '';
  
  // Convert to string and uppercase
  let normalized = String(code).toUpperCase().trim();
  
  // Remove spaces and hyphens
  normalized = normalized.replace(/[\s\-]/g, '');
  
  // Remove leading zeros for numeric codes
  if (/^\d+$/.test(normalized)) {
    normalized = normalized.replace(/^0+/, '') || '0';
  }
  
  return normalized;
}

/**
 * Search product by any code: EAN, Supplier Code, or Internal Code
 * Uses multi-tier search: exact match -> normalized match -> partial match
 */
function searchProductByCode(code) {
  if (!code) return null;
  
  const productos = getData(SHEETS.PRODUCTOS);
  const searchCode = String(code).trim();
  const normalizedSearch = normalizeCode(searchCode);
  
  // TIER 1: Exact match (fastest, most accurate)
  let product = productos.find(p => 
    p.EAN == searchCode || 
    p.Codigo_Proveedor == searchCode || 
    p.Codigo_Producto == searchCode
  );
  
  if (product) {
    Logger.log('Product found with exact match: ' + searchCode);
    return {
      found: true,
      source: 'Base de datos local',
      matchType: 'exact',
      matchField: getMatchField(product, searchCode),
      product: product
    };
  }
  
  // TIER 2: Normalized match (flexible matching)
  product = productos.find(p => 
    normalizeCode(p.EAN) == normalizedSearch || 
    normalizeCode(p.Codigo_Proveedor) == normalizedSearch || 
    normalizeCode(p.Codigo_Producto) == normalizedSearch
  );
  
  if (product) {
    Logger.log('Product found with normalized match: ' + searchCode);
    return {
      found: true,
      source: 'Base de datos local',
      matchType: 'normalized',
      matchField: getMatchField(product, searchCode, true),
      product: product
    };
  }
  
  // TIER 3: Partial match (contains search term)
  if (searchCode.length >= 4) { // Only for codes with 4+ characters
    product = productos.find(p => 
      (p.EAN && String(p.EAN).includes(searchCode)) ||
      (p.Codigo_Proveedor && String(p.Codigo_Proveedor).toUpperCase().includes(searchCode.toUpperCase())) ||
      (p.Codigo_Producto && String(p.Codigo_Producto).toUpperCase().includes(searchCode.toUpperCase()))
    );
    
    if (product) {
      Logger.log('Product found with partial match: ' + searchCode);
      return {
        found: true,
        source: 'Base de datos local',
        matchType: 'partial',
        matchField: getMatchField(product, searchCode),
        product: product
      };
    }
  }
  
  return null;
}

/**
 * Helper to identify which field matched
 */
function getMatchField(product, searchCode, normalized) {
  if (normalized) {
    const normalizedSearch = normalizeCode(searchCode);
    if (normalizeCode(product.EAN) == normalizedSearch) return 'EAN';
    if (normalizeCode(product.Codigo_Proveedor) == normalizedSearch) return 'Código Proveedor';
    if (normalizeCode(product.Codigo_Producto) == normalizedSearch) return 'Código Producto';
  } else {
    const search = String(searchCode).toUpperCase();
    if (product.EAN && String(product.EAN).includes(searchCode)) return 'EAN';
    if (product.Codigo_Proveedor && String(product.Codigo_Proveedor).toUpperCase().includes(search)) return 'Código Proveedor';
    if (product.Codigo_Producto && String(product.Codigo_Producto).toUpperCase().includes(search)) return 'Código Producto';
  }
  return 'Código';
}

/**
 * Get category templates with suggested fields and suppliers
 */
function getCategoryTemplate(categoria) {
  const templates = {
    'Material Eléctrico': {
      campos_sugeridos: ['Voltaje', 'Amperaje', 'Tipo'],
      proveedores: ['Elektra', 'Gabyl', 'Saltoki']
    },
    'Fontanería': {
      campos_sugeridos: ['Diámetro', 'Material', 'Presión'],
      proveedores: ['Saltoki', 'Gabyl']
    },
    'Herramientas': {
      campos_sugeridos: ['Marca', 'Modelo', 'Tipo'],
      proveedores: ['Wurth', 'Gabyl']
    },
    'Repuestos': {
      campos_sugeridos: ['Modelo Compatible', 'Marca', 'Referencia'],
      proveedores: ['Wurth', 'Saltoki']
    }
  };
  
  return templates[categoria] || {
    campos_sugeridos: [],
    proveedores: ['Saltoki', 'Elektra', 'Gabyl', 'Wurth', 'Otro']
  };
}

/**
 * Get list of all suppliers
 */
function getSuppliers() {
  return ['Saltoki', 'Elektra', 'Gabyl', 'Wurth', 'Otro'];
}

/**
 * Import products from CSV content
 * Returns summary of import operation
 */
function importProductsFromCSV(csvContent) {
  try {
    Logger.log('Starting CSV import...');
    
    // Parse CSV
    const rows = Utilities.parseCsv(csvContent);
    
    if (rows.length < 2) {
      return {
        success: false,
        error: 'El archivo CSV está vacío o solo contiene encabezados'
      };
    }
    
    // Get headers (first row)
    const headers = rows[0].map(h => h.trim());
    Logger.log('Headers: ' + headers.join(', '));
    
    // Validate required columns
    if (!headers.includes('Nombre')) {
      return {
        success: false,
        error: 'El CSV debe contener al menos la columna "Nombre"'
      };
    }
    
    // Get existing products for duplicate detection
    const existingProducts = getData(SHEETS.PRODUCTOS);
    
    // Process each row
    const results = {
      total: rows.length - 1, // Exclude header
      created: 0,
      updated: 0,
      errors: [],
      warnings: []
    };
    
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      
      try {
        // Skip empty rows
        if (row.every(cell => !cell || cell.trim() === '')) {
          results.warnings.push(`Fila ${i + 1}: Fila vacía, omitida`);
          continue;
        }
        
        // Parse row into product object
        const productData = parseCSVRow(row, headers);
        
        // Validate required fields
        if (!productData.Nombre || productData.Nombre.trim() === '') {
          results.errors.push(`Fila ${i + 1}: Falta el nombre del producto`);
          continue;
        }
        
        // Check for duplicates
        const duplicate = findDuplicateProduct(productData, existingProducts);
        
        if (duplicate) {
          // Update existing product
          productData.Id_Producto = duplicate.Id_Producto;
          saveRecord(SHEETS.PRODUCTOS, productData);
          results.updated++;
          Logger.log(`Row ${i + 1}: Updated product ${productData.Nombre}`);
        } else {
          // Create new product
          saveRecord(SHEETS.PRODUCTOS, productData);
          results.created++;
          Logger.log(`Row ${i + 1}: Created product ${productData.Nombre}`);
        }
        
      } catch (e) {
        results.errors.push(`Fila ${i + 1}: ${e.message}`);
        Logger.log(`Error in row ${i + 1}: ${e.message}`);
      }
    }
    
    results.success = true;
    Logger.log('Import completed: ' + JSON.stringify(results));
    return results;
    
  } catch (e) {
    Logger.log('Import failed: ' + e.toString());
    return {
      success: false,
      error: 'Error al procesar el archivo: ' + e.message
    };
  }
}

/**
 * Parse a CSV row into a product object
 */
function parseCSVRow(row, headers) {
  const product = {};
  
  // Map CSV columns to product fields
  const columnMapping = {
    'Nombre': 'Nombre',
    'Descripcion': 'Descripcion',
    'EAN': 'EAN',
    'Codigo_Proveedor': 'Codigo_Proveedor',
    'Proveedor': 'Proveedor',
    'Categoria': 'Categoria',
    'Codigo_Producto': 'Codigo_Producto',
    'Stock_Minimo': 'Stock_Minimo',
    'URL_Foto': 'URL_Foto'
  };
  
  headers.forEach((header, index) => {
    const fieldName = columnMapping[header];
    if (fieldName && row[index] !== undefined) {
      let value = row[index];
      
      // Trim strings
      if (typeof value === 'string') {
        value = value.trim();
      }
      
      // Convert Stock_Minimo to number
      if (fieldName === 'Stock_Minimo' && value) {
        value = parseInt(value) || 0;
      }
      
      product[fieldName] = value;
    }
  });
  
  // Set defaults
  if (!product.Stock_Minimo) product.Stock_Minimo = 0;
  if (!product.URL_Foto) product.URL_Foto = '';
  
  return product;
}

/**
 * Find duplicate product by EAN, Codigo_Proveedor, or Codigo_Producto
 */
function findDuplicateProduct(productData, existingProducts) {
  // Check by EAN
  if (productData.EAN) {
    const byEAN = existingProducts.find(p => 
      p.EAN && p.EAN.toString().trim() === productData.EAN.toString().trim()
    );
    if (byEAN) return byEAN;
  }
  
  // Check by Codigo_Proveedor
  if (productData.Codigo_Proveedor) {
    const byCodigoProveedor = existingProducts.find(p => 
      p.Codigo_Proveedor && 
      p.Codigo_Proveedor.toString().trim().toUpperCase() === productData.Codigo_Proveedor.toString().trim().toUpperCase()
    );
    if (byCodigoProveedor) return byCodigoProveedor;
  }
  
  // Check by Codigo_Producto
  if (productData.Codigo_Producto) {
    const byCodigoProducto = existingProducts.find(p => 
      p.Codigo_Producto && 
      p.Codigo_Producto.toString().trim().toUpperCase() === productData.Codigo_Producto.toString().trim().toUpperCase()
    );
    if (byCodigoProducto) return byCodigoProducto;
  }
  
  return null;
}

/**
 * Generate a sample CSV template
 */
function generateSampleCSV() {
  const headers = ['Nombre', 'Descripcion', 'EAN', 'Codigo_Proveedor', 'Proveedor', 'Categoria', 'Codigo_Producto', 'Stock_Minimo'];
  const samples = [
    ['Marco simple LS 990', 'Marco simple blanco', '4011377114609', 'LS 981 WW', 'JUNG', 'Material Eléctrico', 'JUNG-001', '5'],
    ['Grifo temporizado', 'Grifo temporizado PRESTO', '8427838346018', 'PRES-123', 'PRESTO', 'Fontanería', 'PRESTO-001', '3'],
    ['Cable 2.5mm', 'Cable eléctrico 2.5mm', '', 'CAB-2.5', 'Elektra', 'Material Eléctrico', 'ELEC-CAB-001', '10']
  ];
  
  const csvRows = [headers.join(',')];
  samples.forEach(row => {
    csvRows.push(row.map(cell => `"${cell}"`).join(','));
  });
  
  return csvRows.join('\n');
}
function getConfig(configType) {
  const sheet = getSheet(SHEETS.CONFIGURACION);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const typeIndex = headers.indexOf('Tipo');
  const valueIndex = headers.indexOf('Valor');
  
  if (typeIndex === -1 || valueIndex === -1) return [];
  
  return data.slice(1)
    .filter(row => row[typeIndex] === configType)
    .map(row => row[valueIndex])
    .filter(val => val);
}
function addConfigValue(configType, value) {
  if (!value) return { success: false, error: 'Valor vacío' };
  
  const sheet = getSheet(SHEETS.CONFIGURACION);
  const existing = getConfig(configType);
  
  if (existing.includes(value)) {
    return { success: false, error: 'Ya existe' };
  }
  
  const timestamp = new Date().toISOString();
  sheet.appendRow([configType, value, timestamp]);
  
  return { success: true };
}
function deleteConfigValue(configType, value) {
  const sheet = getSheet(SHEETS.CONFIGURACION);
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const typeIndex = headers.indexOf('Tipo');
  const valueIndex = headers.indexOf('Valor');
  
  for (let i = data.length - 1; i > 0; i--) {
    if (data[i][typeIndex] === configType && data[i][valueIndex] === value) {
      sheet.deleteRow(i + 1);
      return { success: true };
    }
  }
  
  return { success: false, error: 'No encontrado' };
}
function getAllConfig() {
  return {
    proveedores: getConfig('Proveedor'),
    categorias: getConfig('Categoria')
  };
}