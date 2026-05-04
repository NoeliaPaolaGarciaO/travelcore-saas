console.log("PROVEEDORES PRO");

async function verHistorialProveedor(id){

    const { data } = await supabase
        .from("files")
        .select("*");

    let movimientos = [];

    data.forEach(f => {
        if(f.pagos){
            f.pagos.forEach(p => {
                if(p.proveedor_id === id){
                    movimientos.push(p);
                }
            });
        }
    });

    historialProveedor.innerHTML = movimientos.map(m => `
        <div class="card">
            ${m.fecha?.split("T")[0]}
            <br>$${m.monto}
            <br>${m.estado}
        </div>
    `).join("");
}