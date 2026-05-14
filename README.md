# NexaDrive - Car Rental Platform

Aplicación móvil desarrollada en React Native (Expo) diseñada para digitalizar y optimizar el proceso de renta de vehículos. Proporciona una interfaz fluida para la búsqueda de sucursales, gestión de rentas y autenticación segura.

## Características Principales

* **Autenticación Segura:** Integración con Firebase Authentication y Google Sign-In.
* **Geolocalización en Tiempo Real:** Visualización de sucursales y rastreo mediante `react-native-maps` y la API de geolocalización.
* **Gestión de Fechas y Reservas:** Control preciso de periodos de renta con `datetimepicker`.
* **UI/UX Fluida:** Navegación optimizada mediante React Navigation (Stack & Drawer) y animaciones nativas con Reanimated.

## Stack Tecnológico

* **Frontend:** React Native (v0.79), Expo (v53), React (v19)
* **Navegación:** React Navigation v7
* **BaaS (Backend as a Service):** Firebase (v11)
* **Mapas:** React Native Maps

## Requisitos Previos

* Node.js (v18 o superior recomendado)
* npm o yarn
* Cuenta de Expo y Expo Go instalado en tu dispositivo físico (o emuladores configurados).

## Instalación y Configuración Local

1. Clonar el repositorio:
   ```bash
   git clone https://github.com/AxelLaraG/nexa-drive-app.git
   cd nexa-drive-app
   ```
2. Instalar dependencias:
   ```bash
   npm install
   ```
3. Configuración de Variables de Entorno
   Crear un archivo `.env` en la raíz del proyecto basándose en el archivo `.env.example` y añade tus credenciales de Firebase y Google Maps.
4. Ejecutar el servidor de desarrollo:
   ```bash
   npm start
   ```
## Arquitectura y Escalabilidad
El proyecto está modularizado para soportar crecimiento a largo plazo.

- **Separación de responsabilidades:** Las pantallas (/Screens, /Tabs) están desacopladas de los componentes reutilizables (/Components).
- **Estilos centralizados:** Mantenimiento de un sistema de diseño base en /Styles.
- **Servicios externos:** La lógica de Firebase está aislada en el directorio /firebase, facilitando una futura migración si se requiere un backend propio en Node.js/PostgreSQL.
