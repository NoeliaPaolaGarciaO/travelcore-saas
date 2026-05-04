function nav(id){
  document.querySelectorAll("section").forEach(s=>s.style.display="none");
  document.getElementById(id).style.display="block";
}

function renderClientes(){
  listaClientes.innerHTML = "";
  DB.clientes.forEach(c=>{
    listaClientes.innerHTML += `<li class="clienteItem">${c.nombre}</li>`;
  });

  fCliente.innerHTML = DB.clientes.map(c=>`<option>${c.nombre}</option>`);
}

function renderProveedores(){
  listaProveedores.innerHTML = "";
  DB.proveedores.forEach(p=>{
    listaProveedores.innerHTML += `<li class="proveedorItem">${p.nombre}</li>`;
  });
}

function renderServicios(){
  listaServicios.innerHTML = servicios.map(s=>
    `<li>${s.tipo} - ${s.proveedor} - ${s.venta}</li>`
  ).join("");
}

function renderPagos(){
  listaPagos.innerHTML = pagos.map(p=>
    `<li>${p.tipo} - ${p.monto}</li>`
  ).join("");
}

function renderFiles(){
  let filtro = buscar.value.toLowerCase();

  tablaFiles.innerHTML = DB.files
    .filter(f=>f.cliente.toLowerCase().includes(filtro))
    .map((f,i)=>`
      <tr>
        <td>${f.cliente}</td>
        <td>${f.concepto}</td>
        <td>${f.ingreso}</td>
        <td>${f.egreso}</td>
        <td>${f.ganancia}</td>
        <td><button onclick="voucher(${i})">Ver</button></td>
      </tr>
    `).join("");
}

function voucher(i){
  let f = DB.files[i];

  let w = window.open();

  w.document.write(`
    <h1>Farobeno Viajes</h1>
    <h2>${f.cliente}</h2>
    <p>${f.concepto}</p>

    <h3>Servicios</h3>
    ${f.servicios.map(s=>`<p>${s.tipo} - ${s.proveedor}</p>`).join("")}
  `);

  w.print();
}

function renderStats(){
  let total = DB.files.reduce((a,f)=>a+f.ganancia,0);
  stats.innerHTML = "Ganancia total: " + total;
}

renderClientes();
renderProveedores();
renderFiles();
renderStats();