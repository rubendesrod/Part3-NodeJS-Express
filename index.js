const express = require("express");
const app = express();

app.use(express.json());

// Array de objetos de personas que hay en la agenda
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// LLamada a la API para recibir la informacion
app.get("/info", (request, response) => {
  response.send(`
    Phonebook han info for ${persons.length}
    <br/>
    ${Date()}
  `);
});

// Llamada a la API para recibir todas las personas
app.get("/api/persons", (request, response) => {
  response.json(persons);
});

// Llamada a la API para que envía una persona concreta
app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);
  if (person) {
    response.json(person);
  } else {
    response.status(404).end();
  }
});

// Llamada a la API para poder elimina una persona
app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  // Copiamos el mismo array de personas,
  // filtrando para que la tenga el mismo id no la inserte en el nuevo
  persons = persons.filter((person) => person.id !== id);
  // Se response con un estado 204 de correcto
  console.log(persons);
  response.status(204).end();
});

// Función para generar un ID
const generateId = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

// LLamada a la API para poder añadir a una persona a la agenda
app.post("/api/persons", (request, response) => {
  const body = request.body;

  if (!body.name) {
    return response.status(400).json({
      error: "Falta nombre",
    });
  }

  if (!body.number) {
    return response.status(400).json({
      error: "Falta el telefono de la persona",
    });
  }
  // Comprobar si la persona ya existe en la agenda
  const personExists = persons.some((person) => person.name === body.name);

  if (personExists) {
    return response.status(400).json({
      error: "Esa persona ya existe en la agenda",
    });
  }

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.json(person);
});

// Puerto por el que escucha la aplicación una vez se inicia
const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
