# Dentro de frontend/todolist

### `npm install`

Instalara todos los paquetes necesarios.

### `npm start`

Ejecuta la aplicación en modo de desarrollo.
Abre [http://localhost:3000](http://localhost:3000) para verla en el navegador.

La página se recargará cuando hagas cambios.

### `npm run build`

Minifica y agrupa la aplicacion. lista para produccion.

1. `npm install -g serve` 2.`serve -s build`

# Dentro de backend

1. `python -m venv env`
2. `source ./env/bin/activate`
3. `pip install -r requirements.txt`

## Dentro de backend/todolist

### Crear un usuario

1. `python manage.py shell`
2. `from django.contrib.auth.models import User`
3. `user = User.objects.create_user(username='test', email='exampleuser@example.com', password='test')`

### Como correr el servidor

1. `python manage.py makemigrations`
2. `python manage.py migrate`
3. `python manage.py runserver`

### Testing

`python manage.py test`
