async function crearCuenta(){

    const email = oEmail.value;
    const password = oPassword.value;
    const nombreAgencia = oAgencia.value;

    // 1. auth
    const { data, error } = await supabase.auth.signUp({
        email,
        password
    });

    if(error) return alert(error.message);

    // 2. agencia
    const { data: agencia } = await supabase
        .from("agencias")
        .insert([{
            nombre: nombreAgencia,
            plan: "free"
        }])
        .select()
        .single();

    // 3. usuario
    await supabase.from("usuarios").insert([{
        email,
        rol: "admin",
        auth_id: data.user.id,
        agencia_id: agencia.id
    }]);

    alert("Cuenta creada 🚀");

    window.location.href = "index.html";
}