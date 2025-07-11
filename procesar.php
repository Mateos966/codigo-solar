<?php
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nombre = htmlspecialchars(trim($_POST["nombre"]));
  $email = htmlspecialchars(trim($_POST["email"]));
  $mensaje = htmlspecialchars(trim($_POST["mensaje"]));

  $archivo = fopen("mensajes.txt", "a");
  $contenido = "Nombre: $nombre\nCorreo: $email\nMensaje: $mensaje\n----------------------\n";
  fwrite($archivo, $contenido);
  fclose($archivo);

  http_response_code(200); // Éxito
} else {
  http_response_code(403); // Acceso no permitido
}
?>