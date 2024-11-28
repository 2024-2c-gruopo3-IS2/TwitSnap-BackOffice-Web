# Manual de Usuario - TwitSnap BackOffice 

![alt text](</src/assets/images/logo_con_fondo.png>)

## Introducción
Este es el manual de usuario para el frontend de la aplicación TwitSnap BackOffice. En este manual se describen las funcionalidades y características de la aplicación, así como los pasos necesarios para su instalación y uso.

## Instalación
Para instalar la aplicación, se deben seguir los siguientes pasos:
1. Instalar las dependencias del proyecto:
```bash
npm install
```
2. Iniciar la aplicación:
```bash
npm start
```

## Uso

### Inicio de sesión
Para iniciar sesión en la aplicación, se debe ingresar el correo electrónico y la contraseña en los campos correspondientes y hacer clic en el botón "Iniciar Sesión".

![alt text](</src/assets/doc_images/Login/Login.png>)

En caso de ingresar credenciales incorrectas, se mostrará un mensaje de error.
![alt text](</src/assets/doc_images/Login/LoginFallido.png>)

### Registro

En caso de no tener una cuenta en la plataforma, el usuario puede registrarse haciendo clic en el enlace "Registrarse" en la página de inicio de sesión. Luego, se debe ingresar la información solicitada en el formulario y hacer clic en el botón "Regístrate".

![alt text](</src/assets/doc_images/Signup/Signup.png>)

La contraseña debe tener 8 caracteres o más y contener al menos una letra mayúscula, un número y un carácter especial. De lo contrario, se mostrará un mensaje de error.

![alt text](</src/assets/doc_images/Signup/SignupFallido.png>)

### Página de inicio

Una vez iniciada la sesión, se mostrará la página de inicio de la aplicación. En esta página se puede ver una barra lateral con las opciones de navegación y una sección para ver el perfil. 

![alt text](<src/assets/doc_images/Profile/Home.png>)

Al hacer click en el botón "Mi Perfil" se mostrará la información del usuario. Además se muestra un botón para cerrar la sesión.

![alt text](</src/assets/doc_images/Profile/Perfil.png>)

### Servicios

Seleccionando la opción "Servicios" en la barra lateral, se mostrará una lista de los servicios disponibles. Para cada servicio se muestra el nombre, la descripción, fecha de creación, estado actual, un botón para bloquear y desbloquear los servicios y un botón para ver más detalles. Además, se puede filtrar la lista de servicios por nombre, estado y fecha de creación.

![alt text](</src/assets/doc_images/Services/Services.png>)

Al hacer clic en el botón + se mostrará una ventana emergente con información adicional sobre el servicio. En esta ventana se puede ver la url del servicio, el tiempo de ejecución y dos gráficos con el uso de CPU y memoria del servicio.

![alt text](</src/assets/doc_images/Services/ServicesDetalles.png>)

Para filtrar por nombre se debe colocar la parte del nombre del servicio que se desea ver.

![alt text](</src/assets/doc_images/Services/ServicesNombre.png>)

Para filtrar por estado se debe seleccionar el estado del servicio que se desea ver en el menú desplegable.

![alt text](</src/assets/doc_images/Services/ServicesEstadoActivo.png>)

![alt text](</src/assets/doc_images/Services/ServicesEstadoSuspendido.png>)

Para filtrar por fecha de creación se debe seleccionar la fecha de creación del servicio que se desea ver en el menú desplegable.

![alt text](</src/assets/doc_images/Services/ServicesFecha.png>)

### Bloquear Usuarios

Seleccionando la opción "Bloquear Usuarios" en la barra lateral, se mostrará una lista de los usuarios de la plataforma mobile. Para cada usuario se muestra el nombre de usuario, el correo electrónico, el estado del usuario y un botón para bloquear y desbloquear los usuarios y un botón para ver más detalles. 

![alt text](</src/assets/doc_images/BlockUsers/BlockUsers.png>)

Al hacer clic en el botón + se mostrará una ventana emergente con información adicional sobre el usuario. En esta ventana se pueden ver los detalles del perfil de ese usuario. Se muestra nombre de usuario, correo electrónico, estado, nombre completo, fecha de nacimiento, ubicación e intereses.

![alt text](</src/assets/doc_images/BlockUsers/BlockUsersDetalles.png>)

Al hacer click en el botón "Bloquear" se mostrará una pantalla emergente para confirmar la acción. Se debe seleccionar una razón para el bloqueo y una cantidad de días entre 2 y 14. Luego, se debe hacer clic en el botón "Bloquear" para confirmar la acción.

![alt text](</src/assets/doc_images/BlockUsers/BlockUsersPantallaBloqueo.png>)

Una vez que el usuario está bloqueado, se muestra en elos detalles del usuario la razón del bloqueo y la cantidad de días que permanecerá bloqueado.

![alt text](</src/assets/doc_images/BlockUsers/BlockUsersDetallesBloqueado.png>)

### Verificar Usuarios

Seleccionando la opción "Verificar Usuarios" en la barra lateral, se mostrará una lista de los usuarios de la plataforma mobile mostrando su estado de verificación, su nombre de usuario, su apellido y su nombre. Los usuarios verificados aparecen en verde, los no verificados en rojo y los pendientes en naranja.

![alt text](</src/assets/doc_images/UserVerify/Verify.png>)

Haciendo click en cada perfil se abre un menú desplegable con distinta información según el estado de la verificación de cada usuario.

Los usuarios no verificados muestran esta información

![alt text](</src/assets/doc_images/UserVerify/VerifyRojo.png>)

Los usuarios verificados muestran esta información

![alt text](</src/assets/doc_images/UserVerify/VerifyVerde.png>)

Haciendo click en la foto se puede ampliar para verla con más detalle.

![alt text](</src/assets/doc_images/UserVerify/VerifyVerdeFoto.png>)

Los usuarios pendientes muestran esta información

![alt text](</src/assets/doc_images/UserVerify/VerifyNaranja.png>)

Al hacer click en "Validar" se aprueba la verificación del usuario.

Además se puede filtrar la lista de usuarios por nombre de usuario y estado de verificación.

![alt text](</src/assets/doc_images/UserVerify/VerifyFiltroNombre.png>)

![alt text](</src/assets/doc_images/UserVerify/VerifyFiltroRojo.png>)

![alt text](</src/assets/doc_images/UserVerify/VerifyFiltroVerde.png>)

![alt text](</src/assets/doc_images/UserVerify/VerifyFiltroNaranja.png>)

### TwitSnaps

Seleccionando la opción "TwitSnaps" en la barra lateral, se mostrará una lista de los TwitSnaps publicados en la plataforma mobile. Para cada TwitSnap se muestra el mensaje, el autor, la fecha de creación del Snap, un botón para bloquear o desbloquear un Snap y un botón para ver más detalles.

Un Snap bloqueado no desaparecerá de la lista de TwitSnaps, pero no podrá ser visualizado por los usuarios de la plataforma mobile. En caso de error o revisión, se puede desbloquear el Snap para que vuelva a estar disponible.

![alt text](</src/assets/doc_images/TwitSnaps/TwitSnaps.png>)

Al hacer clic en el botón + se mostrará una ventana emergente con información adicional sobre el Snap. En esta ventana se puede ver el mensaje del Snap, el autor, el correo electrónico, la cantidad de Likes, la fecha de creación, los hashtags del mensaje (Si los tiene) y el estado del Snap.

![alt text](</src/assets/doc_images/TwitSnaps/TwitSnapsEstadoDesBloqueado.png>)

![alt text](</src/assets/doc_images/TwitSnaps/TwitSnapsDetalleBloqueado.png>)

Se puede filtrar la lista de TwitSnaps por autor, mensaje, fecha de creación y estado.

![alt text](</src/assets/doc_images/TwitSnaps/TwitSnapsFiltroMensaje.png>)

![alt text](</src/assets/doc_images/TwitSnaps/TwitSnapsFiltroAutor.png>)

![alt text](</src/assets/doc_images/TwitSnaps/TwitSnapsFiltroFecha.png>)

### Métricas

Seleccionando la opción "Métricas" en la barra lateral, se mostrará una lista de las métricas de la plataforma mobile. 


Hay metrícas para los usuarios registrados mostrando cantidad, tiempo promedio y tasa de éxito.

Lo mismo para los inicios de sesión.

![alt text](</src/assets/doc_images/Metrics/Metrics1.png>)

También hay métricas para los usuarios bloqueados mostrando el correo electrónico, la razón del bloqueo y la cantidad de días.

![alt text](</src/assets/doc_images/Metrics/Metrics2.png>)

Finalmente se muestran las métricas de los recuperos de contraseña. Se muestra la cantidad de recuperaciones exitosas, el tiempo promedio y la tasa de éxito.

Tambień se muestran los usuarios por zona geográfica. Se muestra la cantidad de usuarios por país.

![alt text](</src/assets/doc_images/Metrics/Metrics3.png>)

## 

