# Gestión de Productos Financieros - Ejercicio Técnico Angular

Este proyecto es una aplicación de gestión de productos financieros construida con Angular 14.

## 🚀 Funcionalidades Implementadas

- **F1. Listado de Productos Financieros:** Visualización de productos con estados de carga (skeletons) y manejo de errores locales.
- **F2. Búsqueda:** Filtrado en tiempo real por nombre y descripción.
- **F3. Paginación y Tamaño de Página:** Registros configurables por página (5, 10, 20) con controles de navegación.
- **F4. Agregar Producto:** Formulario de registro completo con validaciones personalizadas síncronas y asíncronas.
- **F5. Editar Producto:** Menú desplegable contextual para editar productos existentes (campo ID deshabilitado).
- **F6. Eliminar Producto:** Modal de confirmación antes de la eliminación permanente.

## 🛠 Tecnologías Utilizadas

- **Angular 14**
- **TypeScript 4.7**
- **Jest** (Pruebas unitarias y Cobertura)
- **Vanilla CSS/SCSS** (Sin frameworks de UI externos)
- **Diseño Responsivo** (Optimizado para móviles y escritorio)

## 📦 Configuración y Ejecución

### 1. Configuración del Backend
1. Descomprima el archivo `repo-interview-main.zip` proporcionado en el reto.
2. Abra una terminal en esa carpeta.
3. Ejecute `npm install`.
4. Inicie la API con `npm run start:dev`.
5. El servicio estará disponible en `http://localhost:3002`.

### 2. Configuración del Frontend
1. Clone este repositorio o abra la carpeta del proyecto.
2. Ejecute `npm install`.
3. Ejecute `npm start` para iniciar el servidor de desarrollo.
4. Navegue a `http://localhost:4200/`.

## 🧪 Pruebas Unitarias

El proyecto utiliza **Jest** para las pruebas unitarias, cubriendo servicios, componentes, pipes y validadores personalizados.

- **Ejecutar todas las pruebas:** `npm test`
- **Ejecutar pruebas con cobertura:** `npm run test:coverage`
- **Modo observador (watch):** `npm run test:watch`

**Cobertura Actual:** ~89% (Requerimiento: >70%)

## 📋 Buenas Prácticas y Decisiones de Diseño

- **Principios SOLID:** Aplicados en toda la arquitectura (Responsabilidad Única en servicios y componentes).
- **Clean Code:** Nombramiento semántico, modularidad y funciones enfocadas.
- **Experiencia de Usuario (UX):** Manejo optimizado de errores en imágenes y cargadores animados (skeletons).
- **Escalabilidad:** Módulo Core para servicios singleton y Módulo Shared para componentes y pipes reutilizables.
