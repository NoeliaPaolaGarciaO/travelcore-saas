async function irAPago(){

    const usuario = JSON.parse(localStorage.getItem("usuarioActivo"));

    const res = await fetch("/functions/v1/create-checkout", {
        method: "POST",
        body: JSON.stringify({
            agencia_id: usuario.agencia_id
        })
    });

    const data = await res.json();

    window.location.href = data.url;
}