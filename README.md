# **Proyecto IS2**

## **Descripción**  
Este proyecto consiste en el desarrollo de una **aplicación web** para [objetivo del proyecto, ej. gestionar inventarios, registrar usuarios, etc.] como parte del curso **Ingeniería de Software II**.  
La aplicación fue desarrollada utilizando **React.js** para el frontend, **Node.js** con Express para el backend y **MongoDB** como base de datos.

---

## **Características**  
- CRUD de [descripción, ej. usuarios, productos, tareas, etc.].  
- Interfaz amigable y dinámica utilizando **React.js**.  
- API REST construida con **Node.js y Express**.  
- Base de datos NoSQL implementada con **MongoDB**.  
- Seguridad de las claves API mediante variables de entorno (**dotenv**).  

---

## **Instalación**  
Sigue estos pasos para inicializar el proyecto localmente:

### **Requisitos previos**  
- Node.js y npm instalados.  
- MongoDB configurado localmente o en la nube.  
- Claves API (si se utilizan servicios externos como **SendGrid**).  

### **Instrucciones**  
1. **Clonar el repositorio:**  
   ```bash
   git clone git@github.com:frandiaz99/PaginaWebFerreteria.git
   cd proyecto-is2
   ```

2. **Instalar las dependencias:**  
   ```bash
   # Instalar dependencias del backend
   cd backend
   npm install

   # Instalar dependencias del frontend
   cd ../frontend
   npm install
   ```

3. **Configurar variables de entorno:**  
   Crea un archivo `.env` en la carpeta `backend` con las siguientes claves:  
   ```env
   PORT=5000
   MONGODB_URI=tu_cadena_de_conexion
   SENDGRID_API_KEY=tu_api_key
   ```

4. **Iniciar el proyecto:**  
   ```bash
   # Iniciar el servidor backend
   cd backend
   npm start

   # Iniciar el servidor frontend
   cd ../frontend
   npm start
   ```

---

## **Uso**  
Accede a la aplicación en [http://localhost:3000](http://localhost:3000) una vez iniciados ambos servidores.  

---

## **Tecnologías utilizadas**  
- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Base de Datos:** MongoDB  
- **Envío de correos:** SendGrid API (opcional)  

---

## **Contribuir**  
Si deseas contribuir a este proyecto, por favor:  
1. Haz un **fork** del repositorio.  
2. Crea una nueva rama para tus cambios:  
   ```bash
   git checkout -b feature/nueva-funcionalidad
   ```
3. Realiza los cambios y crea commits descriptivos.  
4. Sube tus cambios al repositorio:  
   ```bash
   git push origin feature/nueva-funcionalidad
   ```
5. Abre una **pull request**.

---

## **Autores**  
- **Tu Nombre** - Desarrollo y documentación  
- **Otros colaboradores** *(si aplica)*  

---

## **Licencia**  
Este proyecto está bajo la licencia MIT. Puedes consultar el archivo [LICENSE](LICENSE) para más detalles.

---

## **Estado del Proyecto**  
🛧 **En desarrollo** 🛧  
