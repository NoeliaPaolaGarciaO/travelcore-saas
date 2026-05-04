const hostname = window.location.hostname;

// ej: agencia1.tuapp.com
const subdominio = hostname.split(".")[0];

async function cargarAgenciaPorDominio(){

    if(subdominio === "localhost" || subdominio === "127"){
        return null;
    }

    const { data } = await supabase
        .from("agencias")
        .select("*")
        .eq("dominio", subdominio)
        .single();

    return data;
}