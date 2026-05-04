# 🚀 TravelCore SaaS

Sistema SaaS para agencias de viajes  
Gestión de clientes, archivos, vouchers, proveedores y finanzas en una sola plataforma.

---

## 🌍 ¿Qué es TravelCore?

TravelCore es un sistema multi-tenant pensado para agencias de turismo que necesitan:

- 📁 Gestión de archivos (viajes)
- 👥 Clientes
- 🧾 Vouchers públicos
- 🏦 Proveedores y cuentas
- 📊 Dashboard financiero
- 💳 Suscripciones tipo SaaS (Stripe-ready)

---

## 🧠 Stack Tecnológico

- Frontend: HTML + CSS + JS
- Backend: Supabase (Auth + DB + Edge Functions)
- Base de datos: PostgreSQL
- Pagos: Stripe
- Hosting: (pendiente deploy)

---

## 🏗️ Arquitectura

- Multi-tenant por `agencia_id`
- Autenticación con Supabase Auth
- Datos aislados por agencia
- Edge Functions para pagos (Stripe)

---

## 🚀 Cómo levantar el proyecto

### 1. Clonar repo

```bash
git clone https://github.com/TU_USUARIO/travelcore-saas.git
cd travelcore-saas
```

---

### 2. Configurar Supabase

Crear archivo:

```
js/supabase.js
```

```js
const SUPABASE_URL = "TU_URL";
const SUPABASE_KEY = "TU_PUBLIC_KEY";

window.supabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_KEY
);
```

---

### 3. Ejecutar SQL

Ir a Supabase → SQL Editor  
Ejecutar el script completo de tablas

---

### 4. Correr local

Abrir con Live Server:

```
login.html
```

---

## 🔐 Variables sensibles

NO subir:

- STRIPE_SECRET
- SERVICE_ROLE_KEY
- Webhooks secrets

---

## 👤 Roles

- `admin` → control total
- `ventas` → operaciones
- (expandible)

---

## 💳 Sistema SaaS

- Trial automático (10 días)
- Suscripción mensual
- Bloqueo por vencimiento
- Integración con Stripe

---

## 🤝 Contribuciones

Este proyecto acepta colaboración, pero bajo estas reglas:

### ✔ Se permite
- Mejoras de UI
- Optimización de código
- Nuevas features
- Fix de bugs

### ❌ No se permite
- Cambiar lógica core sin discusión
- Romper multi-tenant
- Modificar sistema de pagos sin aprobación

---

## 📌 Cómo contribuir

1. Fork del repo
2. Crear branch:

```bash
git checkout -b feature/nueva-funcionalidad
```

3. Commit:

```bash
git commit -m "feat: mejora en dashboard"
```

4. Push:

```bash
git push origin feature/nueva-funcionalidad
```

5. Pull Request

---

## 🧠 Filosofía

TravelCore busca ser:

- Simple
- Escalable
- Multi-agencia real
- SaaS listo para monetizar

---

## ⚠️ Estado del proyecto

🟡 MVP avanzado  
🟢 Listo para testeo real  
🚧 En camino a producción

---

## 👨‍💻 Autor

Desarrollado por Noelia  
Proyecto en evolución 🚀

---

## 📬 Contacto

noeeegarcia@gmail.com

---

## ⭐ Si te sirve

Dejá una estrella al repo 🙌
