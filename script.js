// script.js
const users = [
    { username: 'antonino', passwordHash: '77d45f6fb06209ae10dfcea1dc43a452de933a9b8eef025b480f99270a26dc2a' },
    { username: 'marco', passwordHash: '77d45f6fb06209ae10dfcea1dc43a452de933a9b8eef025b480f99270a26dc2a' },
    { username: 'daiana', passwordHash: '77d45f6fb06209ae10dfcea1dc43a452de933a9b8eef025b480f99270a26dc2a' }
];

// Funzione di login
function login(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const hashedPassword = CryptoJS.SHA256(password).toString();

    console.log("Hash: " + hashedPassword);
    const user = users.find(user => user.username === username);
    if (user && user.passwordHash === hashedPassword) {
        loadInvitationPage();
    } else {
        alert("Username o password errati");
    }
}

// Form di login
function loadLoginForm() {
    document.getElementById('main').innerHTML = `
        <h2>Login</h2>
        <form onsubmit="login(event)">
            <div class="mb-3">
                <label for="username" class="form-label">Username</label>
                <input type="text" class="form-control" id="username" required>
            </div>
            <div class="mb-3">
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" required>
            </div>
            <button type="submit" class="btn btn-primary">Accedi</button>
        </form>
    `;
}

window.onload = loadLoginForm;

// Funzione per caricare la pagina di gestione degli inviti
function loadInvitationPage() {
    document.getElementById('main').innerHTML = `
        <h2>Gestione Inviti</h2>
        <div class="mb-3">
            <label for="invitationCode" class="form-label">Codice Invito</label>
            <input type="text" class="form-control" id="invitationCode" maxlength="6">
        </div>
        <button class="btn btn-primary" onclick="loadInvitation()">Carica Invito</button>
        <button class="btn btn-success" onclick="createInvitation()">Crea Nuovo Invito</button>
        <div id="invitationDetails"></div>
    `;
}

// Funzione per creare un nuovo invito
function createInvitation() {
    const name = prompt("Inserisci il nome dell'invito (es: Pier & Eleonora)");
    if (name) {
        axios.post('https://antoninoedaiana.it/api/invitations', { name })
            .then(response => {
                const invitationId = response.data.invitationId;
                alert(`Nuovo invito creato con codice: ${invitationId}`);
            })
            .catch(error => {
                console.error("Errore nella creazione dell'invito", error);
            });
    }
}

// Funzione per caricare i dettagli di un invito
function loadInvitation() {
    const invitationId = document.getElementById('invitationCode').value;
    if (invitationId) {
        axios.get(`https://antoninoedaiana.it/api/invitations/${invitationId}`)
            .then(response => {
                const invitation = response.data;
                displayInvitationDetails(invitation);
            })
            .catch(error => {
                console.error("Errore nel caricamento dell'invito", error);
            });
    } else {
        alert("Inserisci un codice invito valido");
    }
}

// Funzione per mostrare i dettagli dell'invito
function displayInvitationDetails(invitation) {
    let guestList = invitation.guests.map(guest => `
        <li>${guest.fullName} - ${guest.status} 
            <button class="btn btn-danger btn-sm" onclick="removeGuest(${guest.guestId})">Rimuovi</button>
        </li>
    `).join('');

    document.getElementById('invitationDetails').innerHTML = `
        <h3>Dettagli Invito: ${invitation.name}</h3>
        <p>Status: ${invitation.status}</p>
        <p>Commenti: ${invitation.comment}</p>
        <h4>Invitati:</h4>
        <ul>${guestList}</ul>
        <button class="btn btn-warning" onclick="deleteInvitation('${invitation.invitation_id}')">Rimuovi Invito</button>
        <button class="btn btn-primary" onclick="addGuest('${invitation.invitation_id}')">Aggiungi Invitato</button>
    `;
}

// Funzione per aggiungere un invitato
function addGuest(invitationId) {
    const fullName = prompt("Inserisci il nome completo dell'invitato");
    if (fullName) {
        axios.post(`https://antoninoedaiana.it/api/invitations/${invitationId}/guests`, {
            fullName: fullName,
            estimatedPartecipation: true
        }).then(() => {
            alert("Invitato aggiunto con successo");
            loadInvitation(); // ricarica i dettagli dell'invito
        }).catch(error => {
            console.error("Errore nell'aggiunta dell'invitato", error);
        });
    }
}

// Funzione per rimuovere un invitato
function removeGuest(guestId) {
    axios.delete(`https://antoninoedaiana.it/api/guests/${guestId}`)
        .then(() => {
            alert("Invitato rimosso con successo");
            loadInvitation(); // ricarica i dettagli dell'invito
        })
        .catch(error => {
            console.error("Errore nella rimozione dell'invitato", error);
        });
}

// Funzione per rimuovere un invito
function deleteInvitation(invitationId) {
    if (confirm("Sei sicuro di voler rimuovere questo invito?")) {
        axios.delete(`https://antoninoedaiana.it/api/invitations/${invitationId}`)
            .then(() => {
                alert("Invito rimosso con successo");
                loadInvitationPage(); // Torna alla pagina di gestione inviti
            })
            .catch(error => {
                console.error("Errore nella rimozione dell'invito", error);
            });
    }
}