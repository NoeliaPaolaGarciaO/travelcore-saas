console.log("ADMIN SAAS PRO");

async function cargarMetricas(){

    const { data } = await supabase
        .from("agencias")
        .select("*");

    let mrr = 0;
    let activos = 0;
    let churn = 0;

    data.forEach(a => {

        if(a.plan === "pro" && a.estado_suscripcion === "activa"){
            mrr += 20;
        }

        if(a.estado_suscripcion === "activa"){
            activos++;
        }

        if(a.estado_suscripcion === "cancelada"){
            churn++;
        }
    });

    document.getElementById("mrr").innerText = "$" + mrr;
    document.getElementById("activos").innerText = activos;
    document.getElementById("churn").innerText = churn;
}

cargarMetricas();