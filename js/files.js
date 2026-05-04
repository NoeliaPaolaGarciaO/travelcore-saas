console.log("FILES PRO");

async function checkAuth(){

    const { data } = await supabase.auth.getUser();

    if(!data.user){
        window.location.href = "login.html";
        return;
    }

    const { data: usuarioDB } = await supabase
        .from("usuarios")
        .select("*")
        .eq("auth_id", data.user.id)
        .single();

    window.usuario = usuarioDB;
}

let clientesDB = [];
let acompanantes = [];
let pagosProveedor = [];

let proveedoresDB = [];
let cuentasDB = [];

// =======================
// CLIENTES
// =======================
async function cargarClientes(){
    const { data } = await supabase.from("clientes").select("*");
    clientesDB = data || [];
    renderSelect(clientesDB);
}

function renderSelect(lista){
    const options = lista.map(c =>
        `<option value="${c.id}">${c.nombre} ${c.apellido}</option>`
    ).join("");

    fCliente.innerHTML = `<option value="">Seleccionar</option>` + options;
    selectAcompanante.innerHTML = fCliente.innerHTML;
}

// =======================
// ACOMPAÑANTES
// =======================
function agregarAcompanante(){
    const id = selectAcompanante.value;
    const c = clientesDB.find(x => x.id === id);

    if(!c || acompanantes.some(a => a.id === id)) return;

    acompanantes.push(c);
    renderAcompanantes();
}

function renderAcompanantes(){
    listaAcompanantes.innerHTML = acompanantes.map(a => `
        <div class="card">${a.nombre} ${a.apellido}</div>
    `).join("");
}

// =======================
// PROVEEDORES
// =======================
async function cargarProveedores(){
    const { data } = await supabase.from("proveedores").select("*");
    proveedoresDB = data || [];

    selectProveedor.innerHTML = proveedoresDB.map(p => `
        <option value="${p.id}">${p.nombre}</option>
    `).join("");

    cargarCuentas();
}

async function cargarCuentas(){

    const { data } = await supabase
        .from("proveedor_cuentas")
        .select("*")
        .eq("proveedor_id", selectProveedor.value);

    cuentasDB = data || [];

    selectCuenta.innerHTML = cuentasDB.map(c => `
        <option value="${c.id}">
            ${c.banco} - ${c.moneda}
        </option>
    `).join("");
}

selectProveedor.addEventListener("change", cargarCuentas);

// =======================
// PAGOS PROVEEDOR
// =======================
function agregarPagoProveedor(){

    const proveedor = proveedoresDB.find(p => p.id === selectProveedor.value);
    const cuenta = cuentasDB.find(c => c.id === selectCuenta.value);
    const monto = Number(montoProveedor.value);

    if(!proveedor || !cuenta || !monto){
        return alert("Completar datos");
    }

    pagosProveedor.push({
        proveedor: proveedor.nombre,
        proveedor_id: proveedor.id,
        banco: cuenta.banco,
        moneda: cuenta.moneda,
        monto,
        estado: "pendiente",
        fecha: new Date().toISOString()
    });

    renderPagosProveedor();
}

function renderPagosProveedor(){

    listaPagosProveedor.innerHTML = pagosProveedor.map((p,i) => `
        <div class="card" style="border-left:5px solid ${p.estado==="pendiente"?"red":"green"}">
            ${p.proveedor} - $${p.monto}
            <br>${p.estado.toUpperCase()}
            ${
                p.estado === "pendiente"
                ? `<button onclick="marcarPagado(${i})">Marcar Pagado</button>`
                : ""
            }
        </div>
    `).join("");
}

function marcarPagado(index){
    pagosProveedor[index].estado = "pagado";
    renderPagosProveedor();
}

// =======================
// GUARDAR FILE
// =======================

async function guardarFile(){

    const cliente = clientesDB.find(c => c.id === fCliente.value);
    if(!cliente) return alert("Seleccionar cliente");

    const pasajeros = [cliente, ...acompanantes];

    const egreso = pagosProveedor.reduce((a,b)=>a+b.monto,0);

    const token = crypto.randomUUID(); // 🔥 LINK PUBLICO

    const { error } = await supabase.from("files").insert([{
        cliente: cliente.nombre + " " + cliente.apellido,
        cliente_id: cliente.id,
        concepto: fConcepto.value,
        pasajeros,
        pagos: pagosProveedor,
        egreso,
        public_token: token,
        agencia_id: usuario.agencia_id
    }]);

    if(error) return alert("Error");

    alert("File guardado 🔥");

    const link = window.location.origin + "/voucher-publico.html?token=" + token;

    console.log("LINK CLIENTE:", link);

    pagosProveedor = [];
    acompanantes = [];

    renderFiles();
}

// =======================
// LISTAR
// =======================
async function renderFiles(){

    const { data } = await supabase.from("files").select("*");

    tablaFiles.innerHTML = data.map(f => `
        <tr>
            <td>${f.cliente}</td>
            <td>${f.concepto}</td>
            <td>$${f.egreso || 0}</td>
            <td>${renderPagosHistorial(f)}</td>
        </tr>
    `).join("");
}

function renderPagosHistorial(file){

    if(!file.pagos) return "";

    return file.pagos.map((p,i)=>`
        <div>
            ${p.proveedor} - $${p.monto}
            (${p.estado})
            ${
                p.estado === "pendiente"
                ? `<button onclick="pagarDesdeHistorial('${file.id}', ${i})">Pagar</button>`
                : ""
            }
        </div>
    `).join("");
}

async function pagarDesdeHistorial(fileId, index){

    const { data } = await supabase
        .from("files")
        .select("*")
        .eq("id", fileId)
        .single();

    let pagos = data.pagos;
    pagos[index].estado = "pagado";

    await supabase
        .from("files")
        .update({ pagos })
        .eq("id", fileId);

    renderFiles();
}

// INIT
cargarClientes();
cargarProveedores();
renderFiles();