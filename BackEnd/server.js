import app from "./app.js";

const PORT = process.env.PORT ?? 7001;

app.listen(PORT, function () {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
