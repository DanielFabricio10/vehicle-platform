const express = require('express');
const vehicleRoutes = require('./routes/vehicleRoutes'); // Importando o router
const saleRoutes = require('./routes/saleRoutes');

const app = express();
const port = 3000;

app.use(express.json());


app.use('/api/vehicles', vehicleRoutes);
app.use('/api/sales', saleRoutes);

app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}`);
});
