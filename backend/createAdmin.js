fetch("http://localhost:5000/api/admin/register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ username: "admin", password: "password123" })
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.error(err));
