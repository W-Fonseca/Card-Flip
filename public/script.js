
    // ################## ROTINAS $ VARIAVEIS GLOBAIS #################//


    let currentUser = null; // Variável global para armazenar o usuário logado
    let meusCards = null;

    // Configuração do Firebase
    const firebaseConfig = {
    apiKey: "AIzaSyBJUf5mgF-tKtrWTKyhO964RxCec_Nmqco",
    authDomain: "cardflipbook.firebaseapp.com",
    databaseURL: "https://cardflipbook-default-rtdb.firebaseio.com",
    projectId: "cardflipbook",
    storageBucket: "cardflipbook.firebasestorage.app",
    messagingSenderId: "686869193936",
    appId: "1:686869193936:web:27c02b8739e20ab2f2ead5"
  };

    document.addEventListener('contextmenu', function (e) {
        e.preventDefault();
        menu.style.left = e.pageX + 'px';
        menu.style.top = e.pageY + 'px';
        menu.style.display = 'block';
        ajustarMenu(menu);
        submenu.style.display = 'none';
        //   subsubmenu1.style.display = 'none';
        //    subsubmenu2.style.display = 'none';
    });

    document.addEventListener('click', function (e) {
        if (!menu.contains(e.target) && !submenu.contains(e.target)) {
            menu.style.display = 'none';
            submenu.style.display = 'none';
            submenu2.style.display = 'none';
            submenu3.style.display = 'none';
            //    subsubmenu1.style.display = 'none';
            //   subsubmenu2.style.display = 'none';
        }
    });

    opcao1.addEventListener('click', function (e) {
        submenu.style.left = (menu.offsetLeft + menu.offsetWidth) + 'px';
        submenu.style.top = menu.offsetTop + 'px';
        submenu.style.display = 'block';
        ajustarMenu(submenu);
        submenu2.style.display = 'none';
        submenu3.style.display = 'none';
    });

    opcao2.addEventListener('click', function (e) {
        submenu2.style.left = (menu.offsetLeft + menu.offsetWidth) + 'px';
        submenu2.style.top = menu.offsetTop + 'px';
        submenu2.style.display = 'block';
        ajustarMenu(submenu2);
        submenu.style.display = 'none';
        submenu3.style.display = 'none';
    });

    opcao3.addEventListener('click', function (e) {
        submenu3.style.left = (menu.offsetLeft + menu.offsetWidth) + 'px';
        submenu3.style.top = menu.offsetTop + 'px';
        submenu3.style.display = 'block';
        ajustarMenu(submenu3);
        // Oculta os outros submenus
        submenu.style.display = 'none';
        submenu2.style.display = 'none';
    });


    function ajustarMenu(menu) {
        const contentEl = document.getElementsByClassName("content")[0];
        const janelaLargura = contentEl.clientWidth;
        const janelaAltura = contentEl.clientHeight;
        const contentLeft = contentEl.getBoundingClientRect().left;
        const contentTop = contentEl.getBoundingClientRect().top;

        const menuRect = menu.getBoundingClientRect();

        // Ajuste horizontal
        if (menuRect.right > contentLeft + janelaLargura) {
            const novaEsquerda = contentLeft + janelaLargura - menu.offsetWidth;
            menu.style.left = Math.max(novaEsquerda, contentLeft) + 'px';
        }

        // Ajuste vertical
        if (menuRect.bottom > contentTop + janelaAltura) {
            const novoTopo = contentTop + janelaAltura - menu.offsetHeight;
            menu.style.top = Math.max(novoTopo, contentTop) + 'px';
        }
    }



    // Variável global para armazenar o cartão selecionado
    let selectedCard = null;
    let selectedImg = null;
    let posX = 0, posY = 0;
    let startX, startY;
    let isDragging = false;

    const app = firebase.initializeApp(firebaseConfig);
    const database = firebase.database();

    let trofeus = {
        bronze: "🥉",
        prata: "🥈",
        ouro: "🏆"
        //     bronze: 'data:image/png;base64,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',
        //     prata: 'data:image/png;base64,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',    // idem
        //     ouro: 'data:image/png;base64,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'    // idem
    };
    // document.getElementById('trofeus-ouro-img').src = trofeus.ouro;
    // document.getElementById('trofeus-prata-img').src = trofeus.prata;
    // document.getElementById('trofeus-bronze-img').src = trofeus.bronze;

    // document.getElementById('trofeu-img-ouro').src = trofeus.ouro;
    // document.getElementById('trofeu-img-prata').src = trofeus.prata;
    // document.getElementById('trofeu-img-bronze').src = trofeus.bronze;

    document.addEventListener("DOMContentLoaded", () => {
        const storedUser = localStorage.getItem("currentUser");

        if (storedUser) {
            currentUser = storedUser;


            const usuarioRef = database.ref(`usuarios/${currentUser}/welcome/boasvindas`);
            usuarioRef.once("value").then((snapshot) => {
                const boasVindas = snapshot.val();
                document.getElementById('welcome-message').style.display = boasVindas ? 'none' : 'block';
            });

            // Atualizar o nome do usuário na barra
            document.getElementById("user-display").textContent = `${currentUser}`;

            // Mostrar elementos de usuário logado
            document.getElementById("navbar").classList.remove("hidden");


            // Ocultar os formulários de login e registro
            document.getElementById("login-container").classList.add("hidden");
            document.getElementById("register-container").classList.add("hidden");

            // Carregar sessões e configurações
            loadBackground();
            applyUserDisplayStyle();
            carregarCardsDoUsuarioAtual()

            const TipoLeituraCards = database.ref(`usuarios/${currentUser}/background/load_every_50_cards`)
            TipoLeituraCards.once("value").then((snapshot) => {
                const value = snapshot.val();
                if (value === true) {
                    showSession("home");
                } else {
                    loadAllSessions();
                }
            });
            loadUserList();
            contarTrofeus(storedUser);
            //  makeDraggableZoomable("background-image", "icon-zoom");
            makeDraggableZoomable("user-icon", "icon-zoom");
            makeDraggableZoomable("background-image", "editlayout-zoom");
            makeDraggableZoomable("editicon-child", "icon-zoom");
        } else {
            // Mostrar apenas o formulário de login
            document.getElementById("login-container").classList.remove("hidden");
            document.getElementById("login-container").classList.add("active");
            const scroll = document.getElementById("jogos-scroll");
            const scroll2 = document.getElementById("jogos-scroll2");
            carregarVitrineJogos();
            rolarVitrine(scroll);
            rolarVitrine(scroll2);
            document.getElementById("register-container").classList.add("hidden");
            document.getElementById("register-container").classList.remove("active");
        }
    });

    document.addEventListener("DOMContentLoaded", () => {
        const contextMenu = document.getElementById("menu");
    });

    firebase.database().ref("messages").orderByKey().on("child_added", function (snapshot) {
        const msg = snapshot.val();
        const messagesDiv = document.getElementById("chat-messages");

        // Verifica se o estilo de gradiente existe e ajusta a forma de aplicação
        const gradientStyle = msg.style
            ? `background: ${msg.style}; -webkit-background-clip: text; color: transparent;`
            : 'font-weight: bold;';

        const messageElement = document.createElement("div");
        messageElement.innerHTML = `
  <div class="chat-message">
  <div class="message-header">
    <strong class="username-chat" style="${gradientStyle}">${msg.user}:</strong>
    <span class="timestamp">${msg.timestamp || ""}</span>
  </div>
  <div class="message-body">
    ${msg.text}
  </div>
</div>

`;
        messagesDiv.appendChild(messageElement);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;

    });


    document.addEventListener("DOMContentLoaded", () => {
        const backgroundUrlInput = document.getElementById("background-url");
        const backgroundImg = document.getElementById("background-image");
        if (backgroundUrlInput && backgroundImg) {
            // Atualiza a imagem com o valor atual ao carregar a página
            const url = backgroundUrlInput.value.trim();
            if (url) {
                backgroundImg.src = url;
            }

            // Atualiza a imagem sempre que o valor for alterado
            backgroundUrlInput.addEventListener("input", () => {
                const newUrl = backgroundUrlInput.value.trim();
                backgroundImg.src = newUrl || ""; // Define "" se vazio
            });
        }
    });

    // ################## ROTINAS & VARIAVEIS GLOBAIS #################//

    //###############  FUNCOES ###############//

    function toggleSidebar() {
        const container = document.getElementById('gridContainer');
        container.classList.toggle('sidebar-hidden');
    }
    // Função para alternar entre sessões
    function showSession(session) {
        const sections = ["filmes", "jogos", "livros", "animes", "kids", "series", "editlayout"];
        const usuariopresente = document.getElementById("user-display").textContent
        contarCardsDaSessao(session, usuariopresente);
        // Remover classe 'active' de todos os links
        const navLinks = document.querySelectorAll("#navbar a");
        navLinks.forEach(link => link.classList.remove("active"));

        // Adicionar classe 'active' ao link correspondente
        const selectedLink = Array.from(navLinks).find(link =>
            link.getAttribute("onclick").includes(session)
        );
        if (selectedLink) {
            selectedLink.classList.add("active");
        }

        // Mostrar/ocultar seções
        sections.forEach((s) => {
            const sectionContainer = document.getElementById(s);
            if (sectionContainer) {
                if (s === session) {
                    sectionContainer.classList.add("active");
                    sectionContainer.classList.remove("hidden");
                } else {
                    sectionContainer.classList.remove("active");
                    sectionContainer.classList.add("hidden");
                }
            }
        });

        // Específico para 'jogos'
        const controfeus = document.getElementsByClassName("cont-trofeu");

        const TipoLeituraCards = database.ref(`usuarios/${currentUser}/background/load_every_50_cards`)
        TipoLeituraCards.once("value").then((snapshot) => {
            const value = snapshot.val();
            if (value === true) {
                loadCurrentVisibleSessionOnly(session);
            }
        });

        // Mostrar contadores de avaliação se não for "home"
        const mostrarAvaliacoes = session !== "home";
        const contAvaliacao = document.getElementsByClassName("cont-avaliacao");

        for (let i = 0; i < contAvaliacao.length; i++) {
            contAvaliacao[i].classList.toggle("hidden", !mostrarAvaliacoes);
        }

        // Mostrar contadores de troféu apenas na aba "jogos"
        for (let i = 0; i < controfeus.length; i++) {
            controfeus[i].classList.toggle("hidden", session !== "jogos");
        }

        // Recontar avaliações se não for home
        if (mostrarAvaliacoes) {
            contarAvaliacoesDaSessao(session, usuariopresente);
        }

        if (session === "jogos" && usuariopresente === currentUser) {
            document.getElementById("opcao2").classList.remove("hidden");
        } else {
            document.getElementById("opcao2").classList.add("hidden");
        }


    }

    function contarAvaliacoesDaSessao(sessao, usuario) {
        const ref = database.ref(`usuarios/${usuario}/${sessao}`);
        const contagem = {
            amei: 0,
            gostei: 0,
            meh: 0,
            merda: 0,
            desejo: 0
        };

        ref.once("value").then(snapshot => {
            const data = snapshot.val();
            if (!data) return;

            Object.values(data).forEach(card => {
                const a = card.avaliacao;
                if (a && contagem.hasOwnProperty(a)) {
                    contagem[a]++;
                }
            });

            document.getElementById("avaliacoes-amei").textContent = contagem.amei;
            document.getElementById("avaliacoes-gostei").textContent = contagem.gostei;
            document.getElementById("avaliacoes-meh").textContent = contagem.meh;
            document.getElementById("avaliacoes-merda").textContent = contagem.merda;
            document.getElementById("avaliacoes-desejo").textContent = contagem.desejo;
        });
    }


    function contarCardsDaSessao(sessao, user) {

        if (!user || !sessao) return;
        const ref = database.ref(`usuarios/${user}/${sessao}`);
        ref.once("value").then(snapshot => {
            const data = snapshot.val();
            const total = data ? Object.keys(data).length : 0;
            document.getElementById("contagem-cards").textContent =
                `${total} card(s) em "${sessao}".`;
        });
    }


    function close_editlayout() {
        document.getElementById("editlayout").classList.remove("active");
        document.getElementById("editlayout").classList.add("hidden");
    }

    // Função para adicionar novo cartão ao Firebase e à interface
    function openCardInputModal() {
        document.getElementById('card-input-modal').classList.remove('hidden');
    }

    function closeCardInputModal() {
        document.getElementById('card-input-modal').classList.add('hidden');
        document.getElementById('input-card-name').value = '';
        document.getElementById('input-card-comment').value = '';
        document.getElementById('input-card-image').value = '';
    }

    function submitCardInput() {
        if (!currentUser) {
            msgbox("Você precisa estar logado para adicionar um cartão.", "vermelho");
            return;
        }

        const name = document.getElementById('input-card-name').value.trim();
        const comment = document.getElementById('input-card-comment').value.trim();
        const image = document.getElementById('input-card-image').value.trim();

        const sections = ['filmes', 'jogos', 'livros', 'animes', 'kids', 'series'];
        let session = null;
        for (let s of sections) {
            const el = document.getElementById(s);
            if (el && el.classList.contains('active')) {
                session = s;
                break;
            }
        }

        if (!session) {
            msgbox("Nenhuma seção ativa encontrada.", "vermelho");
            return;
        }

        if (name && comment && image) {
            const cardData = { name, comment, image };
            const cardID = name.replace(/\s+/g, '_').toLowerCase();

            const ref = database.ref(`usuarios/${currentUser}/${session}/${cardID}`);
            ref.set(cardData)
                .then(() => {
                    const cardRow = document.getElementById(`card-row-${session}`);
                    cardRow.appendChild(createCard(cardData, cardID));
                    closeCardInputModal();
                })
                .catch((error) => {
                    msgbox("Erro ao adicionar cartão.", "vermelho");
                });
        } else {
            msgbox("Todos os campos são obrigatórios!", "vermelho");
        }
    }

    // Função para virar a carta ao clicar
    function flipCard(event) {
        const card = event.currentTarget;
        card.classList.toggle("flipped");
    }


    function atribuirTrofeu(tipo) {
        if (selectedCard) {
            // Obter informações do cartão e do Firebase
            const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
            const session = cardRowId.split("-")[2]; // Ex: "animes"
            const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase
            if (!cardKey) {
                msgbox("Não foi possível identificar o cartão.", "vermelho");
                return;
            }
            const ref = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);
            ref.update({ trofeu: tipo })
                .then(() => {
                    msgbox(`Troféu "${tipo}" atribuído com sucesso!`, "verde");
                })
                .catch((error) => {
                });
        }
    }

    function atribuirAvaliacao(nota) {
        if (selectedCard) {
            const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
            const session = cardRowId.split("-")[2]; // Ex: "animes"
            const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase

            if (!cardKey) {
                msgbox("Não foi possível identificar o cartão.", "vermelho");
                return;
            }

            const ref = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);
            ref.update({ avaliacao: nota })
                .then(() => {
                    msgbox(`Avaliação "${nota}" atribuída com sucesso!`, "verde");

                    // Exibir ícone ou texto no card (exemplo: emoji no canto inferior)
                    const badge = document.createElement("div");
                    badge.className = "avaliacao-badge";
                    badge.textContent = nota === "amei" ? "😍" :
                        nota === "gostei" ? "👍" :
                            nota === "meh" ? "😐" :
                                nota === "merda" ? "💩" : 
                                    nota === "desejo" ? "🎯" : "";
                                

                    // Remove badge anterior, se existir
                    selectedCard.querySelector(".avaliacao-badge")?.remove();
                    selectedCard.querySelector(".front").appendChild(badge);
                })
                .catch((error) => {
                    msgbox("Erro ao atribuir avaliação.", "vermelho");
                });
        }
    }

    function removerAvaliacao() {
        if (selectedCard) {
            const cardRowId = selectedCard.closest(".card-row").id;
            const session = cardRowId.split("-")[2];
            const cardKey = selectedCard.getAttribute("data-key");

            if (!cardKey) {
                msgbox("Não foi possível identificar o cartão.", "vermelho");
                return;
            }

            const ref = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);
            ref.update({ avaliacao: null })
                .then(() => {
                    msgbox("Avaliação removida com sucesso!", "verde");

                    // Remove badge visual, se existir
                    selectedCard.querySelector(".avaliacao-badge")?.remove();
                })
                .catch((error) => {
                    msgbox("Erro ao remover avaliação.", "vermelho");
                });
        }
    }



    // Função para editar um campo do cartão
    function editCard() {
        if (!selectedCard) return;

        const cardRowId = selectedCard.closest(".card-row").id;
        const session = cardRowId.split("-")[2];
        const cardKey = selectedCard.getAttribute("data-key");

        if (!cardKey) {
            msgbox("Não foi possível identificar o cartão.", "vermelho");
            return;
        }

        const ref = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);
        const modal = document.getElementById('crop-modal');
        const editable = document.getElementById('editable-img');
        const zoomSlider = document.getElementById('zoom-range');

        const nameField = selectedCard.querySelector(".name")?.textContent || "";
        const commentField = selectedCard.querySelector(".comment")?.textContent || "";

        // Pré-preenche os campos
        document.getElementById("edit-name").value = nameField;
        document.getElementById("edit-comment").value = commentField;
        document.getElementById("edit-image").value = selectedImg.src;

        // Crop config
        if (!selectedImg) return;
        editable.src = selectedImg.src;
        editable.style.left = selectedImg.style.left || "0px";
        editable.style.top = selectedImg.style.top || "0px";
        zoomSlider.value = selectedImg.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || "1";
        editable.style.transform = `scale(${zoomSlider.value})`;

        posX = parseFloat(editable.style.left) || 0;
        posY = parseFloat(editable.style.top) || 0;

        modal.style.display = 'flex';

        // Drag & Drop
        editable.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            editable.style.cursor = 'grabbing';
        };
        document.onmouseup = () => {
            isDragging = false;
            editable.style.cursor = 'grab';
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            editable.style.left = `${posX}px`;
            editable.style.top = `${posY}px`;
        };
        zoomSlider.oninput = () => {
            editable.style.transform = `scale(${zoomSlider.value})`;
        };

        // Aplica tudo
        document.getElementById("apply-all").onclick = () => {
            const updates = {
                name: document.getElementById("edit-name").value,
                comment: document.getElementById("edit-comment").value,
                image: document.getElementById("edit-image").value
            };

            ref.update(updates).then(() => {
                selectedCard.querySelector(".name").textContent = updates.name;
                selectedCard.querySelector(".comment").textContent = updates.comment;
                selectedCard.querySelectorAll(".front img")[0]

                // Aplica posição e zoom
                selectedImg.src = updates.image;
                selectedImg.style.left = `${posX}px`;
                selectedImg.style.top = `${posY}px`;
                selectedImg.style.transform = `scale(${zoomSlider.value})`;
                applyCrop();

                msgbox("Cartão atualizado com sucesso!", "verde");
            }).catch((err) => {
                msgbox("Erro ao salvar: " + err.message, "vermelho");
            });
        };
    }


    function deleteCard() {
        if (selectedCard) {
            // Obter informações do cartão e do Firebase
            const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
            const session = cardRowId.split("-")[2]; // Ex: "animes"
            const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase

            if (!cardKey) {
                msgbox("Não foi possível identificar o cartão.", "vermelho");
                return;
            }

            const ref = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);

            // Confirmar exclusão
            if (confirm("Tem certeza de que deseja excluir este cartão?")) {
                ref.remove()
                    .then(() => {
                        selectedCard.remove(); // Remover da interface
                        msgbox("Cartão excluído com sucesso!", "verde");
                    })
                    .catch((error) => {
                        msgbox(`Erro ao excluir cartão: ${error.message}`, "vermelho");
                    });
            }
        }
    }

    // Criar cartões com a chave do Firebase
    function createCard(data, key) {

        const cardContainer = document.createElement("div");
        cardContainer.classList.add("card-container");
        cardContainer.setAttribute("onclick", "flipCard(event)");
        cardContainer.setAttribute("oncontextmenu", "showContextMenu(event)");
        cardContainer.setAttribute("data-key", key); // Armazena a chave do Firebase

        const card = document.createElement("div");
        card.classList.add("card");

        // Frente da carta
        const front = document.createElement("div");
        front.classList.add("front");
        const img = document.createElement("img");
        img.src = data.image || "https://via.placeholder.com/300x400";
        img.alt = data.name || "Frente da Carta";

        if (data.crop) {
            img.style.position = "absolute";
            img.style.height = "100%";
            img.style.width = "auto";
            img.style.left = data.crop.left || "0px";
            img.style.top = data.crop.top || "0px";
            img.style.transform = `scale(${data.crop.zoom || 1})`;
        }
        front.style.overflow = "hidden";
        front.appendChild(img);

        if (data.rating || data.votes) {
            const badge = document.createElement("div");
            badge.classList.add("rating-badge");
            badge.title = "IMDB";

            const star = document.createElement("div");
            star.classList.add("rating-star");

            const ratingValue = parseFloat((data.rating || "0").replace(",", "."));
            const fillPercent = Math.max(0, Math.min(1, ratingValue / 10)) * 100;

            star.innerHTML = "★";
            star.style.background = `linear-gradient(90deg, gold ${fillPercent}%, #444 ${fillPercent}%)`;
            star.style.webkitBackgroundClip = "text";
            star.style.webkitTextFillColor = "transparent";

            const ratingText = document.createElement("span");
            ratingText.textContent = ` ${data.rating || "-"}`;

            const votesText = document.createElement("div");
            votesText.classList.add("rating-votes");
            votesText.textContent = data.votes ? `${data.votes} votos` : "";

            const starLine = document.createElement("div");
            starLine.classList.add("star-line");
            starLine.appendChild(star);
            starLine.appendChild(ratingText);

            badge.appendChild(starLine);
            badge.appendChild(votesText);

            front.appendChild(badge);
        }



        //         if (data.trofeu) {
        //             const trofeuBadge = document.createElement("div");
        // trofeuBadge.classList.add("trofeu-badge");

        // const trofeuImg = document.createElement("img");
        // if (data.trofeu === "platina") {
        //     trofeuImg.src = trofeus.ouro;
        // } else if (data.trofeu === "zerado") {
        //     trofeuImg.src = trofeus.prata;
        // } else if (data.trofeu === "jogado") {
        //     trofeuImg.src = trofeus.bronze;
        // }
        // trofeuImg.alt = "external-trophy-reward-and-badges-justicon-flat-justicon-1";
        // trofeuImg.style.width = "40px";
        // trofeuImg.style.height = "40px";
        // trofeuImg.style.imageRendering = "auto";

        // trofeuBadge.appendChild(trofeuImg);
        // front.appendChild(trofeuBadge);

        //         }

        if (data.trofeu) {
            const trofeuBadge = document.createElement("div");
            trofeuBadge.classList.add("trofeu-badge");

            const emoji = document.createElement("span");
            //emoji.style.fontSize = "24px"; // ajuste o tamanho conforme necessário

            if (data.trofeu === "platina") {
                emoji.textContent = trofeus.ouro;
                emoji.title = "100%";
            } else if (data.trofeu === "zerado") {
                emoji.textContent = trofeus.prata;
                emoji.title = "Zerado";
            } else if (data.trofeu === "jogado") {
                emoji.textContent = trofeus.bronze;
                emoji.title = "Jogado";
            }

            trofeuBadge.appendChild(emoji);
            front.appendChild(trofeuBadge);
        }


        if (data.avaliacao) {
            const avaliacaoBadge = document.createElement("div");
            avaliacaoBadge.classList.add("avaliacao-badge");

            let emoji = "";
            let title = "";  // variável para o title

            switch (data.avaliacao) {
                case "amei":
                    emoji = "😍";
                    title = "Amei";
                    break;
                case "gostei":
                    emoji = "👍";
                    title = "Gostei";
                    break;
                case "meh":
                    emoji = "😐";
                    title = "Meh";
                    break;
                case "merda":
                    emoji = "💩";
                    title = "Ruim";
                    break;
                case "desejo":
                    emoji = "🎯";
                    title = "Desejo";
                    break;
                default:
                    emoji = "";
                    title = "";
            }

            const emojiSpan = document.createElement("span");
            emojiSpan.textContent = emoji;
            emojiSpan.title = title;           // aqui define o title
            emojiSpan.setAttribute("aria-label", title); // para acessibilidade

            avaliacaoBadge.appendChild(emojiSpan);
            front.appendChild(avaliacaoBadge);

        }


        // Verso da carta
        const back = document.createElement("div");
        back.classList.add("back");

        const cardName = document.createElement("h3");
        cardName.classList.add("name");
        cardName.style.color = "gold"
        cardName.textContent = data.name || "Nome Desconhecido";

        const cardText = document.createElement("div");
        cardText.classList.add("comment");
        cardText.textContent = data.comment || "Descrição não disponível";



        back.appendChild(cardName);
        back.appendChild(cardText);
        card.appendChild(front);
        card.appendChild(back);
        cardContainer.appendChild(card);

        cardContainer.addEventListener('contextmenu', function (event) {
            event.preventDefault();
            selectedCard = this;
            selectedImg = this.querySelector('img');

            const menu = document.getElementById('context-menu');
            menu.style.top = `${event.clientY}px`;
            menu.style.left = `${event.clientX}px`;
            menu.style.display = 'block';
        });

        verificarSeUsuarioTemCard(data, cardContainer);
        return cardContainer;


    }

    function moveCard(newSession) {
        if (!selectedCard) {
            msgbox("Nenhum cartão selecionado.", "vermelho");
            return;
        }

        // Obter informações do cartão e da sessão atual
        const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
        const currentSession = cardRowId.split("-")[2]; // Ex: "animes"
        const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase

        if (!cardKey) {
            msgbox("Não foi possível identificar o cartão.", "vermelho");
            return;
        }

        if (!newSession || !["filmes", "jogos", "livros", "animes", "kids", "series", "editlayout"].includes(newSession)) {
            msgbox("Sessão inválida.", "vermelho");
            return;
        }

        // Referência ao cartão no Firebase
        const currentRef = database.ref(`usuarios/${currentUser}/${currentSession}/${cardKey}`);
        const newRef = database.ref(`usuarios/${currentUser}/${newSession}/${cardKey}`);

        // Mover o cartão
        currentRef.once("value", (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
                newRef.set(cardData) // Adicionar o cartão na nova sessão
                    .then(() => {
                        currentRef.remove() // Remover o cartão da sessão atual
                            .then(() => {
                                selectedCard.remove(); // Remover da interface
                                msgbox("Cartão movido com sucesso!", "verde");
                            })
                            .catch((error) => {

                            });
                    })
                    .catch((error) => {

                    });
            } else {
                msgbox("Não foi possível encontrar os dados do cartão.", "vermelho");
            }
        });
    }

    // Carregar cartões de uma sessão do Firebase

    function loadAllSessions() {
        ["filmes", "jogos", "livros", "animes", "kids", "series", "editlayout"].forEach((session) => loadCards(session));
    }

    //     // Carregar todas as sessões ao iniciar
    //     loadAllSessions v2
    //     function loadAllSessions() {
    //     const sections = ["filmes", "jogos", "livros", "animes", "kids", "series"];
    //     cachedJson = {};
    //     currentOffsetPorSecao = {
    //         filmes: 0,
    //         jogos: 0,
    //         livros: 0,
    //         animes: 0,
    //         kids: 0,
    //         series: 0
    //     };

    //     sections.forEach(session => {
    //         const ref = database.ref(`usuarios/${currentUser}/${session}`);
    //         const cardRow = document.getElementById(`card-row-${session}`);
    //         if (cardRow) cardRow.innerHTML = "";

    //         ref.once("value", (snapshot) => {
    //             const data = snapshot.val();
    //             if (data && cardRow) {
    //                 cachedJson[session] = data;
    //                 loadMoreCards(session); // Carrega os primeiros 50
    //             }
    //         });
    //     });
    // }

    //loadAllSessions v3
    function loadCurrentVisibleSessionOnly(session) {
        if (currentUser != document.getElementById("user-display").innerText) {
            return;
        }
        document.getElementById("contagem-cards").textContent = "";
        cachedJson = {};
        currentOffsetPorSecao = {
            filmes: 0,
            jogos: 0,
            livros: 0,
            animes: 0,
            kids: 0,
            series: 0
        };

        const ref = database.ref(`usuarios/${currentUser}/${session}`);
        const cardRow = document.getElementById(`card-row-${session}`);
        if (cardRow) cardRow.innerHTML = "";

        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            if (data && cardRow) {
                cachedJson[session] = data;
                loadMoreCards(session); // só carrega os 50 primeiros da sessão visível
            }
        });
    }
    // Mostrar formulário de registro
    function showRegister() {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("login-container").classList.remove("active");
        document.getElementById("register-container").classList.remove("hidden");
        document.getElementById("register-container").classList.add("active");
    }

    function showLogin() {
        document.getElementById("register-container").classList.add("hidden");
        document.getElementById("register-container").classList.remove("active");
        document.getElementById("login-container").classList.remove("hidden");
        document.getElementById("login-container").classList.add("active");
    }

    // Registrar novo usuário
    function register() {
        const username = document.getElementById("register-username").value;
        const password = document.getElementById("register-password").value;

        if (!username || !password) {
            msgbox("Preencha todos os campos!", "vermelho");
            return;
        }

        const ref = database.ref(`usuarios/${username}`);
        ref.once("value", (snapshot) => {
            if (snapshot.exists()) {
                msgbox("Usuário já existe!", "vermelho");
            } else {
                ref.set({ senha: password })
                    .then(() => {
                        msgbox("Usuário registrado com sucesso!", "verde");
                        showLogin();
                    })
                    .catch((error) => {
                        msgbox(`Erro ao registrar: ${error.message}`, "vermelho");
                    });
            }
        });
    }

    function loadCards(session) {
        if (!currentUser) {
            return;
        }

        const ref = database.ref(`usuarios/${currentUser}/${session}`);
        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            const cardRow = document.getElementById(`card-row-${session}`);

            if (!cardRow) {
                return;
            }

            cardRow.innerHTML = ""; // Limpar antes de adicionar

            if (data) {
                Object.entries(data).forEach(([key, cardData]) => {
                    cardRow.appendChild(createCard(cardData, key));
                });
            } else {
            }
        }).catch((error) => {
        });
    }


    function moveCard() {
        if (!selectedCard) {
            msgbox("Nenhum cartão selecionado.", "vermelho");
            return;
        }

        // Obter informações do cartão e da sessão atual
        const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
        const currentSession = cardRowId.split("-")[2]; // Ex: "animes"
        const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase

        if (!cardKey) {
            msgbox("Não foi possível identificar o cartão.", "vermelho");
            return;
        }

        // Referência ao cartão no Firebase
        const currentRef = database.ref(`usuarios/${currentUser}/${currentSession}/${cardKey}`);
        const newRef = database.ref(`usuarios/${currentUser}/${newSession}/${cardKey}`);

        // Mover o cartão
        currentRef.once("value", (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
                newRef.set(cardData) // Adicionar o cartão na nova sessão
                    .then(() => {
                        currentRef.remove() // Remover o cartão da sessão atual
                            .then(() => {
                                selectedCard.remove(); // Remover da interface
                                msgbox("Cartão movido com sucesso!", "verde");
                            })
                            .catch((error) => {

                            });
                    })
                    .catch((error) => {

                    });
            } else {

            }
        });
    }

    function moveCardTo(newSession) {
        if (!selectedCard) {
            msgbox("Nenhum cartão selecionado.", "vermelho");
            return;
        }

        // Obter informações do cartão e da sessão atual
        const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
        const currentSession = cardRowId.split("-")[2]; // Ex: "animes"
        const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase

        if (!cardKey) {
            msgbox("Erro: Não foi possível identificar o cartão.", "vermelho");
            return;
        }

        // Referência ao cartão no Firebase
        const currentRef = database.ref(`usuarios/${currentUser}/${currentSession}/${cardKey}`);
        const newRef = database.ref(`usuarios/${currentUser}/${newSession}/${cardKey}`);

        // Mover o cartão
        currentRef.once("value", (snapshot) => {
            const cardData = snapshot.val();
            if (cardData) {
                newRef.set(cardData) // Adicionar o cartão na nova sessão
                    .then(() => {
                        currentRef.remove() // Remover o cartão da sessão atual
                            .then(() => {
                                selectedCard.remove(); // Remover da interface
                                msgbox(`Cartão movido para ${newSession} com sucesso!`, "verde");
                            })
                            .catch((error) => {

                            });
                    })
                    .catch((error) => {

                    });
            } else {

            }
        });
    }

    // Login do usuário
    function login() {
        const username = document.getElementById("login-username").value;
        const password = document.getElementById("login-password").value;

        if (!username || !password) {
            msgbox("Preencha todos os campos!", "vermelho");
            return;
        }

        const ref = database.ref(`usuarios/${username}`);
        ref.once("value", (snapshot) => {
            if (snapshot.exists() && snapshot.val().senha === password) {
                msgbox("Login realizado com sucesso!", "verde");
                currentUser = username;

                // Salvar o usuário no Local Storage
                localStorage.setItem("currentUser", currentUser);


                const usuarioRef = database.ref(`usuarios/${currentUser}/welcome/boasvindas`);
                usuarioRef.once("value").then((snapshot) => {
                    const boasVindas = snapshot.val();
                    document.getElementById('welcome-message').style.display = boasVindas ? 'none' : 'block';
                });

                // Atualizar o nome do usuário na barra
                document.getElementById("user-display").textContent = `${currentUser}`;

                // Mostrar a barra de navegação e as sessões
                document.getElementById("navbar").classList.remove("hidden");
                document.getElementById("filmes").classList.remove("hidden");
                document.getElementById("jogos").classList.remove("hidden");
                document.getElementById("livros").classList.remove("hidden");
                document.getElementById("animes").classList.remove("hidden");
                document.getElementById("kids").classList.remove("hidden");
                document.getElementById("series").classList.remove("hidden");

                // Ocultar o formulário de login
                document.getElementById("login-container").classList.remove("active");
                document.getElementById("login-container").classList.add("hidden");
                document.getElementById("register-container").classList.remove("active");
                document.getElementById("register-container").classList.add("hidden");


                // Carregar os cartões do usuário
                loadBackground();
                applyUserDisplayStyle();
                const TipoLeituraCards = database.ref(`usuarios/${currentUser}/background/load_every_50_cards`)
                TipoLeituraCards.once("value").then((snapshot) => {
                    const value = snapshot.val();
                    if (value === true) {
                        showSession("home");
                    } else {
                        loadAllSessions();
                    }
                });

                loadUserList();
                contarTrofeus(username);

            } else {
                msgbox("Usuário ou senha incorretos!", "vermelho");
            }
        });
    }

    function logout() {
        // Remover o usuário do Local Storage
        localStorage.removeItem("currentUser");

        // Redefinir a interface
        currentUser = null;
        document.getElementById("user-display").textContent = "";
        document.getElementById("navbar").classList.add("hidden");
        document.getElementById("filmes").classList.add("hidden");
        document.getElementById("jogos").classList.add("hidden");
        document.getElementById("livros").classList.add("hidden");
        document.getElementById("animes").classList.add("hidden");
        document.getElementById("kids").classList.add("hidden");
        document.getElementById("series").classList.add("hidden");

        // Mostrar o formulário de login
        document.getElementById("login-container").classList.add("active");
        document.getElementById("login-container").classList.remove("hidden");

        // Recarregar a página para garantir que o estado seja atualizado
        location.reload();
    }

    // Carregar a imagem de fundo ao iniciar
    function loadBackground() {
        if (!currentUser) return;

        let ref = database.ref(`usuarios/${currentUser}/background`);


        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            if (data) {
                let backgroundStyle = "";

                // Adicionar a imagem de fundo, se existir
                if (data.url && data.url !== "x") {
                    backgroundStyle += `url('')`;

                    document.getElementById("gridContainer").getElementsByClassName("content").src = data.url;
                    document.getElementById("background-url").value = data.url;
                } else {
                    document.getElementById("background-url").value = "";
                }

                // Adicionar a imagem de fundo, se existir
                if (data.iconUrl && data.iconUrl !== "x") {
                    document.getElementById("icon-Url").value = data.iconUrl;
                    document.getElementById("user-icon").src = data.iconUrl;
                    document.getElementById("editicon-child").src = data.iconUrl;
                }

                // if (data.editlayout) {
                //     const layoutImg = document.getElementById("editlayout-child");
                //     layoutImg.style.top = data.editlayout.top || "0px";
                //     layoutImg.style.left = data.editlayout.left || "0px";
                //     layoutImg.style.transform = data.editlayout.zoom || "scale(1)";
                // }

                // if (data.editicon) {
                //     const iconImg = document.getElementById("editicon-child");
                //     iconImg.style.top = data.editicon.top || "0px";
                //     iconImg.style.left = data.editicon.left || "0px";
                //     iconImg.style.transform = data.editicon.zoom || "scale(1)";
                // }

                // Adicionar a cor de fundo (gradiente ou sólida)
                if (data.color1 && data.color2 && data.color1 !== data.color2) {
                    backgroundStyle += `, linear-gradient(135deg, ${data.color1}, ${data.color2})`;
                } else if (data.color1) {
                    backgroundStyle += `, ${data.color1}`;
                }

                // Aplicar o estilo combinado ao body
                //  document.body.style.background = backgroundStyle;
                // Pega o primeiro elemento com a classe "grid-container"
                var gridContainer = document.getElementsByClassName("grid-container")[0];

                // Define o background
                gridContainer.style.background = backgroundStyle;

                //document.body.iconUrl = iconUrl;


                // Atualizar os controles de fundo
                document.getElementById("background-color1").value = data.color1 || "#ffffff";
                document.getElementById("background-color2").value = data.color2 || "#ffffff";


                if (data.userNameStyle) {
                    document.getElementById("user-gradient-color1").value = data.userNameStyle.color1 || "#ffffff";
                    document.getElementById("user-gradient-color2").value = data.userNameStyle.color2 || "#ffffff";
                    document.getElementById("user-border-color").value = data.userNameStyle.border || "#000000";
                    applyUserDisplayStyle(); // aplica o estilo ao vivo
                }
                if (data.backgroundImg) {
                    const bgImg = document.getElementById("background-image");
                    bgImg.src = data.backgroundImg.url;
                    bgImg.style.left = data.backgroundImg.left || "0px";
                    bgImg.style.top = data.backgroundImg.top || "0px";
                    bgImg.style.transform = data.backgroundImg.zoom || "scale(1)";
                    bgImg.style.pointerEvents = "none";
                    bgImg.style.userSelect = "none";
                    bgImg.style.touchAction = "none";
                }

                // if (data.userIcon) {
                //     const icon = document.getElementById("user-icon");
                //     icon.src = data.userIcon.url;
                //     icon.style.left = data.userIcon.left || "0px";
                //     icon.style.top = data.userIcon.top || "0px";
                //     icon.style.transform = data.userIcon.zoom || "scale(1)";
                // }
                if (data.load_every_50_cards !== undefined) {
                    document.getElementById("toggleLoadMode").checked = data.load_every_50_cards;
                } else {
                    document.getElementById("toggleLoadMode").checked = true; // Padrão para true
                }
            }
            applyLayoutCrop(data);

        }).catch((error) => {

        });
    }

    // Chamar a função para carregar a imagem de fundo ao carregar a página
    document.addEventListener("DOMContentLoaded", loadBackground);


    // Salvar a cor de fundo no Firebase
    function saveBackground() {
        if (!currentUser) return;

        const backgroundUrl = document.getElementById("background-url").value;
        const iconUrl = document.getElementById("icon-Url").value;
        const color1 = document.getElementById("background-color1").value;
        const color2 = document.getElementById("background-color2").value;
        const editlayoutImg = document.getElementById("background-image");
        const editiconImg = document.getElementById("editicon-child");
        const load_50_cards = document.getElementById("toggleLoadMode").checked;

        const data = {
            url: backgroundUrl || "x",
            iconUrl: iconUrl || "x",
            color1,
            color2,
            editlayout: {
                top: editlayoutImg.style.top || "0px",
                left: editlayoutImg.style.left || "0px",
                zoom: editlayoutImg.style.transform || "scale(1)"
            },

            userNameStyle: {
                color1: document.getElementById("user-gradient-color1").value,
                color2: document.getElementById("user-gradient-color2").value,
                border: document.getElementById("user-border-color").value
            },
            load_every_50_cards: load_50_cards
        };

        const backgroundImage = document.getElementById("background-image");
        //   const userIcon = document.getElementById("user-icon");

        data.backgroundImg = {
            url: backgroundUrl || "x",
            left: backgroundImage.style.left,
            top: backgroundImage.style.top,
            zoom: backgroundImage.style.transform
        };

        data.userIcon = {
            url: iconUrl || "x",
        };

        const ref = database.ref(`usuarios/${currentUser}/background`);
        ref.set(data).then(() => {
            msgbox("Layout salvo com sucesso!", "verde");
        }).catch((error) => {

        });
    }


    function applyCrop() {
        const editable = document.getElementById('editable-img');
        const zoom = parseFloat(document.getElementById('zoom-range').value);
        const imgLeft = editable.style.left;
        const imgTop = editable.style.top;

        // Aplicar na imagem real
        selectedImg.style.left = imgLeft;
        selectedImg.style.top = imgTop;
        selectedImg.style.transform = `scale(${zoom})`;
        selectedImg.style.position = "absolute";
        selectedImg.style.height = "100%";
        selectedImg.style.width = "auto";

        // SALVAR NO FIREBASE (ajuste o caminho conforme seu projeto!)
        const cardKey = selectedCard.getAttribute("data-key"); // ou outro identificador
        if (!currentUser || !cardKey) return;

        const cardRowId = selectedCard.closest(".card-row").id;
        const session = cardRowId.split("-")[2]; // filmes, jogos, etc.
        const ref = firebase.database().ref(`usuarios/${currentUser}/${session}/${cardKey}`);

        ref.update({
            crop: {
                left: imgLeft,
                top: imgTop,
                zoom: zoom
            }
        }).then(() => {

        });

        closeModal();
    }

    function closeModal() {
        document.getElementById('crop-modal').style.display = 'none';
    }

    function editCardCrop() {
        const modal = document.getElementById('crop-modal');
        const editable = document.getElementById('editable-img');
        const zoomSlider = document.getElementById('zoom-range');

        if (!selectedImg) return;

        // Aplica imagem no editor
        editable.src = selectedImg.src;
        editable.style.left = selectedImg.style.left || "0px";
        editable.style.top = selectedImg.style.top || "0px";
        zoomSlider.value = selectedImg.style.transform?.match(/scale\(([\d.]+)\)/)?.[1] || "1";
        editable.style.transform = `scale(${zoomSlider.value})`;

        // Reset posição
        posX = parseFloat(editable.style.left) || 0;
        posY = parseFloat(editable.style.top) || 0;

        modal.style.display = 'flex';

        // Drag & Drop
        editable.onmousedown = (e) => {
            isDragging = true;
            startX = e.clientX - posX;
            startY = e.clientY - posY;
            editable.style.cursor = 'grabbing';
        };
        document.onmouseup = () => {
            isDragging = false;
            editable.style.cursor = 'grab';
        };
        document.onmousemove = (e) => {
            if (!isDragging) return;
            posX = e.clientX - startX;
            posY = e.clientY - startY;
            editable.style.left = `${posX}px`;
            editable.style.top = `${posY}px`;
        };
        zoomSlider.oninput = () => {
            editable.style.transform = `scale(${zoomSlider.value})`;
        };
    }

    function applyLayoutCrop(data) {
        const bgImg = document.getElementById('background-image');
        // const iconImg = document.getElementById('user-icon');

        if (data.backgroundImg) {
            bgImg.src = data.backgroundImg.url || "";
            bgImg.style.left = data.backgroundImg.left || "0px";
            bgImg.style.top = data.backgroundImg.top || "0px";
            bgImg.style.transform = data.backgroundImg.zoom || "scale(1)";
        }

        try {
            if (data.userIcon) {
                iconImg.src = data.userIcon.url || "x";
            }
        } catch {

        }
    }


    function saveLayoutCropToFirebase() {
        const layout = document.getElementById('editlayout');
        const icon = document.getElementById('edit-icon');

        const cropData = {
            editlayout: {
                background: {
                    url: getComputedStyle(layout).backgroundImage.replace(/^url\(["']?/, '').replace(/["']?\)$/, ''),
                    left: layout.style.backgroundPosition.split(" ")[0] || "0px",
                    top: layout.style.backgroundPosition.split(" ")[1] || "0px",
                    zoom: parseFloat(layout.style.backgroundSize) / 100 || 1
                },
                icon: {
                    url: icon.src,
                    left: icon.style.left || "0px",
                    top: icon.style.top || "0px",
                    zoom: parseFloat(icon.style.transform?.match(/scale\(([\d.]+)\)/)?.[1]) || 1
                }
            }
        };

        firebase.database().ref(`usuarios/${currentUser}/editlayout`).set(cropData.editlayout)
            .then(() => {

            })
            .catch((error) => {

            });
    }

    function makeDraggableZoomable(imgId, zoomSliderId) {
        const img = document.getElementById(imgId);
        const zoomSlider = document.getElementById(zoomSliderId);

        // Evitar duplicação de eventos
        img.onmousedown = null;

        let isDragging = false;
        let startX, startY, startLeft, startTop;

        img.onmousedown = function (e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = parseInt(img.style.left || 0);
            startTop = parseInt(img.style.top || 0);
            img.style.cursor = "grabbing";
        };

        document.onmouseup = () => {
            isDragging = false;
            img.style.cursor = "grab";
        };

        document.onmousemove = (e) => {
            if (!isDragging) return;
            const dx = e.clientX - startX;
            const dy = e.clientY - startY;
            img.style.left = `${startLeft + dx}px`;
            img.style.top = `${startTop + dy}px`;
        };

        zoomSlider.oninput = () => {
            const zoom = parseFloat(zoomSlider.value);
            img.style.transform = `scale(${zoom})`;
        };
    }

    function openBackgroundEditor() {
        const bgImg = document.getElementById("background-image");

        // Ativa interatividade
        bgImg.style.pointerEvents = "auto";
        bgImg.style.userSelect = "auto";
        bgImg.style.touchAction = "auto";

        document.getElementById("editlayout").style.opacity = "0.3";
        document.getElementById("editlayout").style.pointerEvents = "none";
        document.getElementById("confirmBackgroundEdit").style.display = "block";


        makeDraggableZoomable("background-image", "editlayout-zoom");
    }

    function closeBackgroundEditor() {
        const bgImg = document.getElementById("background-image");

        // Volta a desabilitar interatividade
        bgImg.style.pointerEvents = "none";
        bgImg.style.userSelect = "none";
        bgImg.style.touchAction = "none";

        document.getElementById("editlayout").style.opacity = "1";
        document.getElementById("editlayout").style.pointerEvents = "auto";
        document.getElementById("confirmBackgroundEdit").style.display = "none";


        // Opcional: remove eventos se quiser mais limpo
        bgImg.onmousedown = null;
        document.onmousemove = null;
        document.onmouseup = null;
    }


    const inputUrl = document.getElementById("icon-Url");
    const editIconImg = document.getElementById("editicon-child");
    const usersection1 = document.getElementById("user-section1");
    const user_icon = document.getElementById("user-icon");

    inputUrl.addEventListener("input", function () {
        editIconImg.src = this.value;
        usersection1.src = this.value;
        user_icon.src = this.value;
    });

    ["user-gradient-color1", "user-gradient-color2", "user-border-color", "background-color1", "background-color2"].forEach(id => {
        document.getElementById(id).addEventListener("input", applyUserDisplayStyle);
    });

    function applyUserDisplayStyle() {
        const getColor = (id) => document.getElementById(id)?.value || "#000000";

        const color1 = getColor("user-gradient-color1");
        const color2 = getColor("user-gradient-color2");
        const borderColor = getColor("user-border-color");
        const backgroundcolor1 = getColor("background-color1");
        const backgroundcolor2 = getColor("background-color2");

        const userDisplay = document.getElementById("user-display");

        if (userDisplay) {
            userDisplay.style.background = `linear-gradient(to right, ${color1}, ${color2})`;
            userDisplay.style.webkitBackgroundClip = "text";
            userDisplay.style.webkitTextFillColor = "transparent";
            userDisplay.style.border = `0px solid ${borderColor}`;
            // userDisplay.style.borderRadius = "8px";
            // userDisplay.style.display = "inline-block";
        }

        document.documentElement.style.setProperty('--border-color', borderColor);
        document.documentElement.style.setProperty('--gradient-color1', backgroundcolor1);
        document.documentElement.style.setProperty('--gradient-color2', backgroundcolor2);

        // Simples verificação de brilho para toggle-button-color
        const isLight = (hex) => {
            const r = parseInt(hex.substr(1, 2), 16);
            const g = parseInt(hex.substr(3, 2), 16);
            const b = parseInt(hex.substr(5, 2), 16);
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            return brightness > 128;
        };

        const toggleColor = (isLight(backgroundcolor1) && isLight(backgroundcolor2)) ? "#000000" : "#ffffff";
        document.documentElement.style.setProperty('--toggle-button-color', toggleColor);
    }

    const cardsPerLoad = 50;
    let currentOffsetPorSecao = {
        filmes: 0,
        jogos: 0,
        livros: 0,
        animes: 0,
        kids: 0,
        series: 0
    };
    let cachedJson = {};

    function loadUserList() {
        const list = document.getElementById("user-list");
        list.innerHTML = "";

        database.ref("usuarios").once("value", (snapshot) => {
            const users = snapshot.val();

            for (const user in users) {
                if (user != currentUser) {
                    const color1 = users[user]?.background?.userNameStyle?.color1 || "#ffffff";
                    const color2 = users[user]?.background?.userNameStyle?.color2 || "#ffffff";
                    const imgSrc = users[user]?.background?.userIcon?.url || "";

                    const li = document.createElement("li");
                    li.textContent = `${user}`;
                    li.style.setProperty('--color1', color1);
                    li.style.setProperty('--color2', color2);
                    li.className = "username-item";

                    const span = document.createElement("span");
                    span.className = "user-list-item";
                    span.appendChild(li);

                    if (imgSrc.trim() !== "") {
                        const img = document.createElement("img");
                        img.src = imgSrc;
                        img.className = "user-icon-friends";
                        span.appendChild(img);
                    }

                    span.onclick = () => showOtherUserProfile(user);
                    list.appendChild(span);
                }
            }
        });

    }

    function limparTodosOsCards() {
        const sections = ["filmes", "jogos", "livros", "animes", "kids", "series"];
        sections.forEach(session => {
            const cardRow = document.getElementById(`card-row-${session}`);
            if (cardRow) cardRow.innerHTML = "";
        });
    }


    function showOtherUserProfile(user) {
        limparTodosOsCards();
        document.querySelectorAll(".BotaoDireitoMouse").forEach(btn => btn.classList.add("hidden"));
        document.getElementById("opcao2").classList.add("hidden");
        document.getElementById("savebackground")?.remove();
        loadBackgrounduser(user);
        applyUserDisplayStyle();
        contarTrofeus(user);
        document.getElementById("user-display").textContent = `${user}`;

        try {
            document.getElementById("dropdownMenu")?.remove();
        } catch (error) { }

        document.querySelector(".copiarCard").classList.remove("hidden");

        const sections = ["filmes", "jogos", "livros", "animes", "kids", "series"];
        cachedJson = {};
        currentOffsetPorSecao = {
            filmes: 0,
            jogos: 0,
            livros: 0,
            animes: 0,
            kids: 0,
            series: 0
        };

        sections.forEach(session => {
            const ref = database.ref(`usuarios/${user}/${session}`);
            const cardRow = document.getElementById(`card-row-${session}`);
            if (cardRow) cardRow.innerHTML = "";

            ref.once("value", (snapshot) => {
                const data = snapshot.val();
                if (data && cardRow) {
                    cachedJson[session] = data;
                    loadMoreCards(session); // Carrega os primeiros 50
                }
            });
        });

        const activeLink = document.querySelector("#navbar a.active");
        if (activeLink) {
            // Extrai a sessão do atributo onclick (ex: showSession('filmes'))
            const onclickValue = activeLink.getAttribute("onclick");
            const match = onclickValue?.match(/showSession\('([^']+)'\)/);

            if (match && match[1]) {
                const session = match[1]; // exemplo: 'filmes'
                contarCardsDaSessao(session, user);
                contarAvaliacoesDaSessao(session, user);
            }
        }

    }

    let buscando = false;


    function loadMoreCards(section) {
        if (buscando) return; // Não carregar mais se estiver buscando

        const sectionData = cachedJson[section];
        const cardRow = document.getElementById(`card-row-${section}`);
        if (!sectionData || !cardRow) return;

        const entries = Object.entries(sectionData);
        let offset = currentOffsetPorSecao[section];
        const end = Math.min(offset + cardsPerLoad, entries.length);

        // Se já tiver 100 ou mais, remove os 50 primeiros
        if (cardRow.children.length >= 100) {
            for (let i = 0; i < cardsPerLoad; i++) {
                if (cardRow.firstChild) {
                    cardRow.removeChild(cardRow.firstChild);
                }
            }
        }

        for (let i = offset; i < end; i++) {
            const [key, cardData] = entries[i];
            const card = createCard(cardData, key);
            card.querySelector(".card").onclick = null;
            card.oncontextmenu = null;
            cardRow.appendChild(card);
        }

        currentOffsetPorSecao[section] = end;
    }




    function getCurrentVisibleSection() {
        const sections = ["filmes", "jogos", "livros", "animes", "kids", "series"];
        for (const section of sections) {
            const el = document.getElementById(section);
            if (el?.classList.contains("active")) return section;
        }
        return "None";
    }

    // Evento de rolagem global
    document.addEventListener('DOMContentLoaded', () => {
        const sections = ["filmes", "jogos", "livros", "animes", "kids", "series"];

        sections.forEach(sectionId => {
            const contentDiv = document.querySelector(`#${sectionId} .card-row`);
            if (!contentDiv) return;

            contentDiv.addEventListener('scroll', () => {
                if (contentDiv.scrollTop + contentDiv.clientHeight >= contentDiv.scrollHeight - 5) {
                    const currentSection = getCurrentVisibleSection();
                    if (sectionId === currentSection) {
                        loadMoreCards(sectionId);
                    }
                }
            });
        });
    });





    function loadBackgrounduser(usuarioprocurado) {
        const ref = database.ref(`usuarios/${usuarioprocurado}/background`);

        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            const gridContainer = document.getElementsByClassName("grid-container")[0];
            let backgroundStyle = "";

            // BACKGROUND IMAGE
            const backgroundUrl = (data?.url && data.url !== "x") ? data.url : "x";
            document.getElementById("background-url").value = backgroundUrl;

            const content = document.getElementById("gridContainer").getElementsByClassName("content")[0];
            if (content) content.src = backgroundUrl;

            // ICON IMAGE
            const iconUrl = (data?.iconUrl && data.iconUrl !== "x") ? data.iconUrl : "";
            document.getElementById("icon-Url").value = iconUrl;
            document.getElementById("user-icon").src = iconUrl;
            document.getElementById("editicon-child").src = iconUrl;

            // EDITLAYOUT
            const layoutImg = document.getElementById("background-image");
            layoutImg.style.top = data?.editlayout?.top || "0px";
            layoutImg.style.left = data?.editlayout?.left || "0px";
            layoutImg.style.transform = data?.editlayout?.zoom || "scale(1)";

            // BACKGROUND COLORS
            const color1 = data?.color1 || "#ffffff";
            const color2 = data?.color2 || "#ffffff";

            backgroundStyle = (color1 !== color2)
                ? `linear-gradient(135deg, ${color1}, ${color2})`
                : color1;

            gridContainer.style.background = backgroundStyle;
            document.getElementById("background-color1").value = color1;
            document.getElementById("background-color2").value = color2;

            // USERNAME STYLE
            const userStyle = data?.userNameStyle || {};
            document.getElementById("user-gradient-color1").value = userStyle.color1 || "#ffffff";
            document.getElementById("user-gradient-color2").value = userStyle.color2 || "#ffffff";
            document.getElementById("user-border-color").value = userStyle.border || "#000000";
            applyUserDisplayStyle();

            // BACKGROUND IMAGE POSITIONING
            const bgImg = document.getElementById("background-image");
            const bgData = data?.backgroundImg;
            bgImg.src = bgData?.url || "";
            bgImg.style.left = bgData?.left || "0px";
            bgImg.style.top = bgData?.top || "0px";
            bgImg.style.transform = bgData?.zoom || "scale(1)";

            // Apply layout cropping
            applyLayoutCrop(data || {});
        }).catch((error) => {

        });
    }



    function copyCardToMyProfile() {
        if (!currentUser || !selectedCard) return msgbox("Você precisa estar logado.", "vermelho");

        const cardRowId = selectedCard.closest(".card-row").id; // card-row-filmes
        const session = cardRowId.split("-")[2];
        const cardKey = selectedCard.getAttribute("data-key");
        const userOrigin = document.getElementById("user-display").textContent; // Nome do usuário visualizado

        if (!userOrigin || !session || !cardKey) {
            msgbox("dados incompletos para copiar.", "vermelho");
            return;
        }

        const fromRef = database.ref(`usuarios/${userOrigin}/${session}/${cardKey}`);
        const toRef = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);

        fromRef.once("value").then((snapshot) => {
            const data = snapshot.val();
            if (data) {
                return toRef.set(data);
            } else {
                throw new Error("Card não encontrado.", "vermelho");
            }
        }).then(() => {
            msgbox("Card copiado com sucesso!", "verde");
        }).catch((error) => {

            msgbox("Erro ao copiar o card.", "vermelho");
        });

        document.getElementById("menu").style.display = "none"
    }

    // Função para contar os troféus
    function contarTrofeus(usuarioprocurado) {
        let ouro = 0, prata = 0, bronze = 0;

        // Verificar se usuarioprocurado é uma string válida
        if (typeof usuarioprocurado !== 'string' || usuarioprocurado.trim() === '') {
            usuarioprocurado = currentUser;
        }
        // Referência ao Firebase para os cartões do usuário
        let ref = database.ref(`usuarios/${usuarioprocurado}`);
        ref.once("value", (snapshot) => {
            const data = snapshot.val();
            if (data) {
                Object.values(data).forEach(session => {
                    Object.values(session).forEach(card => {
                        if (card.trofeu === "platina") {
                            ouro++;
                        } else if (card.trofeu === "zerado") {
                            prata++;
                        } else if (card.trofeu === "jogado") {
                            bronze++;
                        }
                    });
                });
            }
            // Atualizar os elementos HTML com as quantidades de troféus
            document.getElementById("trofeus-ouro").textContent = `${ouro}`;
            document.getElementById("trofeus-prata").textContent = `${prata}`;
            document.getElementById("trofeus-bronze").textContent = `${bronze}`;
        });
    }

    // Chamar a função contarTrofeus ao carregar a página
    document.addEventListener("DOMContentLoaded", contarTrofeus);


    function removerTrofeu() {
        if (selectedCard) {
            // Obter informações do cartão e do Firebase
            const cardRowId = selectedCard.closest(".card-row").id; // Ex: "card-row-animes"
            const session = cardRowId.split("-")[2]; // Ex: "animes"
            const cardKey = selectedCard.getAttribute("data-key"); // A chave do Firebase
            if (!cardKey) {
                msgbox("Não foi possível identificar o cartão.", "vermelho");
                return;
            }
            const ref = database.ref(`usuarios/${currentUser}/${session}/${cardKey}`);
            ref.update({ trofeu: null })
                .then(() => {
                    msgbox("Troféu removido com sucesso!", "verde");
                    // Atualizar a interface
                    const trofeuImg = selectedCard.querySelector(".front img[src*='trofeus']");
                    if (trofeuImg) {
                        trofeuImg.remove();
                    }
                })
                .catch((error) => {

                });
        }
    }

    // Função para filtrar a lista de usuários
    function filterUserList() {
        const searchInput = document.getElementById('search-bar').value.toLowerCase();
        const userList = document.getElementById('user-list');
        const users = userList.getElementsByTagName('li');

        for (let i = 0; i < users.length; i++) {
            const user = users[i].textContent.toLowerCase();
            if (user.includes(searchInput)) {
                users[i].parentElement.style.display = '';
            } else {
                users[i].parentElement.style.display = 'none';
            }
        }
    }

    // Adicionar evento de input ao campo de pesquisa
    document.getElementById('search-bar').addEventListener('input', filterUserList);

    function fecharboasvindas() {
        if (!currentUser) return;
        let ref = database.ref(`usuarios/${currentUser}/welcome`);
        ref.set({ boasvindas: true })
        const welcomeMessage = document.getElementById('welcome-message');
        welcomeMessage.style.display = 'none';
    }

    function sendMessage() {
        if (!currentUser) return;

        const input = document.getElementById("chat-input");
        const text = input.value.trim();
        if (!text) return;

        const user = currentUser;
        const display = document.getElementById("user-display");
        const color1 = document.getElementById("user-gradient-color1").value;
        const color2 = document.getElementById("user-gradient-color2").value;

        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const padMs = (n) => n.toString().padStart(3, "0");

        const formattedDate =
            `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())} ` +
            `${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}-${padMs(now.getMilliseconds())}`;

        const formattedDateMsg = `${pad(now.getDate())}-${pad(now.getMonth() + 1)}-${now.getFullYear()} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`

        const message = {
            user: user,
            text: text,
            style: `linear-gradient(135deg, ${color1}, ${color2})`,
            timestamp: formattedDateMsg
        };

        const safeKey = Date.now().toString();
        firebase.database().ref("messages/" + formattedDate).set(message);

        input.value = "";
        scrollToBottom();
    }



    document.addEventListener("DOMContentLoaded", function () {
        cleanOldMessages();
    });

    function cleanOldMessages() {
        const now = new Date();
        now.setDate(now.getDate() - 30); // Subtrai 1 dia

        firebase.database().ref("messages").once("value", function (snapshot) {
            snapshot.forEach(function (childSnapshot) {
                const key = childSnapshot.key;

                // Extrai a data e hora da chave
                const [datePart, timePart] = key.split(" ");
                if (!datePart || !timePart) return;

                // Converte para formato ISO: "2025-04-30T16:30:39.122Z"
                const isoString = datePart + "T" + timePart.replace(/-/g, ":").replace(/:(\d{3})$/, ".$1") + "Z";
                const messageDate = new Date(isoString);

                // Compara com 24h atrás
                if (messageDate < now) {
                    firebase.database().ref("messages/" + key).remove();
                }
            });
        });
    }

    function toggleSubmenu(event) {
        // Evitar propagação do evento para o elemento pai
        if (event) {
            event.stopPropagation();
        }

        // Encontrar o submenu associado ao botão
        const submenu = event.target.nextElementSibling;

        if (submenu && submenu.classList.contains("submenu-options")) {
            // Ajustar a posição do submenu para aparecer à direita do botão
            const rect = event.target.getBoundingClientRect(); // Posição do botão
            submenu.style.position = "absolute";
            submenu.style.left = `${rect.right + 10}px`; // Posição à direita do botão
            submenu.style.top = `${rect.top}px`; // Mesma altura do botão
            submenu.classList.toggle("hidden"); // Alternar visibilidade
        }
    }

    function toggletrofeu() {
        const menu = document.getElementById("trofeu-submenu");
        if (menu.style.display === "block") {
            menu.style.display = "none";
        } else {
            menu.style.display = "block";
            const submenu = document.querySelector('.submenu-trofeu');
            submenu.classList.toggle('hidden');
        }
    }

    function mostrarTrofeuSubmenu() {
        const botao = document.getElementById("atribuir-trofeu-btn");
        const submenu = document.getElementById("trofeu-submenu");

        // Corrige a distância — 6px de margem visual
        // Temporariamente exibe para calcular dimensões
        submenu.style.display = "flex";
        submenu.style.position = "absolute";
        submenu.style.visibility = "hidden"; // esconde visualmente, mas permite medir

        // Aguarda renderização para obter tamanho real
        requestAnimationFrame(() => {
            const width = submenu.offsetWidth;
            const height = submenu.offsetHeight;

            const centerX = (window.innerWidth - width) / 2;
            const centerY = (window.innerHeight - height) / 2;

            submenu.style.left = `${centerX}px`;
            submenu.style.top = `${centerY}px`;
            submenu.style.visibility = "visible"; // agora exibe normalmente
        });
    }




    document.addEventListener('click', function (event) {
        const submenu = document.getElementById('trofeu-submenu');
        const context = document.getElementById('context-menu');
        try {
            if (!submenu.contains(event.target) && !context.contains(event.target)) {
                submenu.style.display = 'none';
            }
        } catch { }
    });


    function toggleDropdown(event) {
        event.stopPropagation(); // Impede que o clique propague até o document
        const menu = document.getElementById('dropdownMenu');

        const isVisible = menu.style.display === 'block';
        menu.style.display = isVisible ? 'none' : 'block';
    }

    // Fecha o menu ao clicar fora
    document.addEventListener('click', function (e) {
        const menu = document.getElementById('dropdownMenu');
        if (menu && menu.style.display === 'block') {
            // Fecha o menu ao clicar fora
            if (!menu.contains(e.target)) {
                menu.style.display = 'none';
            }
        }
    });


    // Função para exibir uma mensagem temporária
    function msgbox(msg, cor) {
        const mensagem = document.createElement('div');
        mensagem.innerText = msg;
        mensagem.style.position = 'fixed';
        mensagem.style.top = '20px';
        mensagem.style.left = '50%';
        mensagem.style.transform = 'translateX(-50%)';
        mensagem.style.padding = '10px';
        mensagem.style.borderRadius = '5px';
        mensagem.style.zIndex = '9999';
        mensagem.style.fontSize = '16px';

        // Define a cor com base na presença de "Erro: "
        if (cor === 'vermelho') {
            mensagem.style.backgroundColor = '#f8d7da'; // vermelho claro
            mensagem.style.color = '#721c24'; // vermelho escuro
        } else {
            mensagem.style.backgroundColor = '#d4edda'; // verde claro
            mensagem.style.color = '#155724'; // verde escuro
        }

        document.body.appendChild(mensagem);

        // Esconde a mensagem após 3 segundos
        setTimeout(() => {
            mensagem.remove();
        }, 3000);
    }


    document.getElementById("edit-image").addEventListener("input", function () {
        const newUrl = this.value;
        document.getElementById("editable-img").src = newUrl;
    });

    function exibirCard() {
        if (!selectedCard) {
            msgbox("Selecione uma carta primeiro!", "vermelho");
            return;
        }

        const data = {
            name: selectedCard.querySelector(".name")?.textContent,
            comment: selectedCard.querySelector(".comment")?.textContent,
            image: selectedCard.querySelector(".front img")?.src,
            crop: {
                left: selectedCard.querySelector(".front img")?.style.left,
                top: selectedCard.querySelector(".front img")?.style.top,
                zoom: parseFloat(selectedCard.querySelector(".front img")?.style.transform?.match(/scale\\(([\d.]+)\\)/)?.[1]) || 1
            },
            trofeu: detectaTrofeu(selectedCard.querySelector(".front"))
        };

        const overlay = document.getElementById("cardOverlay");
        overlay.innerHTML = "";

        const cardGrande = createCard(data, "preview");
        cardGrande.classList.add("card-preview");

        // Ajusta a posição da imagem ampliada
        const originalImg = selectedCard.querySelector(".front img");
        const newImg = cardGrande.querySelector(".front img");
        const left = parseFloat(originalImg?.style.left || 0);
        const top = parseFloat(originalImg?.style.top || 0);
        newImg.style.left = `${left * 2}px`;
        newImg.style.top = `${top * 2}px`;

        // Cria container dos botões
        const buttonContainer = document.createElement("div");
        buttonContainer.style.position = "absolute";
        buttonContainer.style.top = "5%";
        buttonContainer.style.left = "50%";
        buttonContainer.style.transform = "translateX(-50%)";
        buttonContainer.style.display = "flex";
        buttonContainer.style.gap = "20px";
        buttonContainer.style.zIndex = "9999";

        // Função para criar botão com emoji e ação
        function criarBotao(emoji, title, onClick) {
            const button = document.createElement("div");
            button.style.width = "64px";
            button.style.height = "64px";
            button.style.cursor = "pointer";
            button.style.borderRadius = "50%";
            button.style.background = "#222";
            button.style.display = "flex";
            button.style.alignItems = "center";
            button.style.justifyContent = "center";
            button.style.fontSize = "40px";
            button.style.color = "#fff";
            button.style.boxShadow = "0 0 10px rgba(0,0,0,0.5)";
            button.title = title;

            // Efeito hover
            button.onmouseover = () => button.style.background = "#444";
            button.onmouseout = () => button.style.background = "#222";

            button.textContent = emoji;
            button.onclick = onClick;

            return button;
        }

        // Botões
        const closeButton = criarBotao("❌", "Fechar", () => {
            overlay.style.display = "none";
        });

        const resetButton = criarBotao("🔄", "Resetar", () => {
            const card = cardGrande.querySelector(".card");
            card.style.transform = "rotateY(0deg)";
        });

        buttonContainer.appendChild(closeButton);
        buttonContainer.appendChild(resetButton);

        overlay.appendChild(buttonContainer);
        overlay.appendChild(cardGrande);
        overlay.style.display = "flex";

        // Garante que o card inicie virado para a frente
        const card = cardGrande.querySelector(".card");
        card.style.transform = "rotateY(0deg)";
        addRotacaoCard(card);
    }



    function detectaTrofeu(frontEl) {
        const trofeu = frontEl.querySelector("img[alt*=trophy]");
        if (!trofeu) return null;

        if (trofeu.src.includes("ouro")) return "platina";
        if (trofeu.src.includes("prata")) return "zerado";
        if (trofeu.src.includes("bronze")) return "jogado";

        return null;
    }
    // Interação para girar com o mouse

    let currentRotationY = 0;

    const card = document.getElementById("card3D");

    card.addEventListener("mousedown", (e) => {
        isDragging = true;
        startX = e.clientX;
        card.style.cursor = "grabbing";
    });

    document.addEventListener("mouseup", () => {
        isDragging = false;
        card.style.cursor = "grab";
    });

    document.addEventListener("mousemove", (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        currentRotationY += deltaX * 0.5;
        card.style.transform = `rotateY(${currentRotationY}deg)`;
        startX = e.clientX;
    });


    function addRotacaoCard(cardEl) {
        let isDragging = false;
        let startX = 0;
        let currentRotationY = 0;

        const updateRotation = (deltaX) => {
            currentRotationY += deltaX * 0.3;
            cardEl.style.transform = `rotateY(${currentRotationY}deg)`;
        };

        // Desktop
        cardEl.addEventListener("mousedown", (e) => {
            isDragging = true;
            startX = e.clientX;
            cardEl.style.cursor = 'grabbing';
            e.preventDefault(); // impede seleção de texto
        });

        document.addEventListener("mouseup", () => {
            isDragging = false;
            cardEl.style.cursor = 'grab';
        });

        document.addEventListener("mousemove", (e) => {
            if (!isDragging) return;
            const deltaX = e.clientX - startX;
            updateRotation(deltaX);
            startX = e.clientX;
        });

        // Mobile
        cardEl.addEventListener("touchstart", (e) => {
            isDragging = true;
            startX = e.touches[0].clientX;
        }, { passive: false });

        cardEl.addEventListener("touchend", () => {
            isDragging = false;
        });

        cardEl.addEventListener("touchmove", (e) => {
            if (!isDragging) return;
            const deltaX = e.touches[0].clientX - startX;
            updateRotation(deltaX);
            startX = e.touches[0].clientX;
            e.preventDefault(); // impede rolagem da página durante rotação
        }, { passive: false });
    }

    function carregarVitrineJogos() {
        console.time('carregarVitrineJogos');  // Começa o tempo de execução da função
        const scroll = document.getElementById("jogos-scroll");
        const scroll2 = document.getElementById("jogos-scroll2");
        let jogos = [];
        let index = 0;
        const startDatabaseRead = Date.now();  // Marca o tempo de início da leitura do Firebase
        database.ref("usuarios").once("value", snapshot => {
            snapshot.forEach(userSnap => {
                const username = userSnap.key;
                const userJogos = userSnap.val().jogos || {};

                Object.values(userJogos).forEach(jogo => {
                    jogos.push({ name: jogo.name, image: jogo.image, username: username });
                });
            });
            carregarItem(jogos, index, scroll);
            carregarItem(jogos, index, scroll2);
            console.timeEnd('carregarVitrineJogos');  // Fim do tempo de execução da função
        });

        function carregarItem(jogos, index, scroll) {
            if (index < jogos.length) {
                const jogo = jogos[index];
                const div = document.createElement("div");
                div.className = "jogo-item";

                // Criar a estrutura de conteúdo antes da imagem
                const content = document.createElement("div");
                content.innerHTML = `<strong>${jogo.name}</strong><br><small>${jogo.username}</small>`;
                div.appendChild(content);

                const img = new Image();
                img.src = jogo.image;
                img.alt = jogo.name;

                img.onload = function () {
                    div.insertBefore(img, content);  // Adiciona a imagem quando carregada
                    scroll.appendChild(div);

                    // A animação de "fade in" ao adicionar um item
                    setTimeout(() => {
                        div.style.opacity = 1;
                        div.style.transform = "translateY(0)";
                    }, 100);

                    // Carregar o próximo item após uma breve pausa
                    setTimeout(() => carregarItem(jogos, index + 1, scroll), 300);  // Espera 300ms antes de carregar o próximo item
                };

                img.style.width = "100%";
                img.style.maxWidth = "120px";
                img.style.height = "120px";
                img.style.objectFit = "cover";
                img.style.borderRadius = "8px";
                img.style.marginBottom = "8px";
            }
        }
    }


    async function rolarVitrine(scroll) {
        function sleep(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        // Detecta se é uma tela de celular (ex: menos de 768px de largura)
        const isMobile = window.innerWidth <= 980;

        // Define tempos diferentes
        const delay = isMobile ? 12000 : 6000;

        await sleep(delay);

        setInterval(() => {
            const scrollHeight = scroll.scrollHeight;
            const clientHeight = scroll.clientHeight;
            const scrollTop = scroll.scrollTop;

            if (scrollTop + clientHeight >= scrollHeight) {
                scroll.scrollTop = 0;
            } else {
                scroll.scrollTop += 1;
            }
        }, 20);
    }

    function filtrarCards() {
        const termo = document.getElementById("card-search").value.toLowerCase().trim();
        const minRating = parseFloat(document.getElementById("min-rating")?.value || "0");
        const maxRating = parseFloat(document.getElementById("max-rating")?.value || "10");
        const minVotes = parseInt(document.getElementById("min-votes")?.value || "0");
        const maxVotes = parseInt(document.getElementById("max-votes")?.value || "999999999");
        const trofeuSelecionado = document.getElementById("filtro-trofeu")?.value.toLowerCase().trim();
        const avaliacaoSelecionada = document.getElementById("filtro-avaliacao")?.value.toLowerCase().trim();
        const minYear = parseInt(document.getElementById("min-year")?.value || "0");
        const maxYear = parseInt(document.getElementById("max-year")?.value || "9999");

        const abas = ['filmes', 'jogos', 'livros', 'animes', 'kids', 'series'];
        const abaAtiva = abas.find(id => {
            const el = document.getElementById(id);
            return el && !el.classList.contains('hidden');
        });

        if (!abaAtiva) return;

        const cardRow = document.getElementById(`card-row-${abaAtiva}`);
        if (!cardRow) return;

        cardRow.innerHTML = "";

        if (
            termo === null &&
            !minRating &&
            !minVotes &&
            maxRating === 10 &&
            maxVotes === 999999999 &&
            minYear === 0 &&
            maxYear === 9999 &&
            trofeuSelecionado === ""
        ) {
            buscando = false;
            loadMoreCards(abaAtiva);
            return;
        }

        buscando = true;

        const user = document.getElementById(`user-display`).innerText;
        const ref = database.ref(`usuarios/${user}/${abaAtiva}`);
        let resultados = 0;

        ref.once("value").then(snapshot => {
            const data = snapshot.val();
            if (!data) return;

            Object.entries(data).forEach(([key, cardData]) => {
                const name = (cardData.name || "").toLowerCase();
                const comment = (cardData.comment || "").toLowerCase();
                const rating = parseFloat((cardData.rating || "0").replace(",", "."));
                const votes = parseVotes(cardData.votes || "");
                const trofeu = (cardData.trofeu || "").toLowerCase().trim();
                const year = parseInt(cardData.year || "0");
                const matchYear = !isNaN(year) && year >= minYear && year <= maxYear;

                const avaliacao = (cardData.avaliacao || "").toLowerCase().trim();
                const matchAvaliacao =
                    avaliacaoSelecionada === "" ||
                    (avaliacaoSelecionada === "sem-avaliacao" && !cardData.avaliacao) ||
                    avaliacao === avaliacaoSelecionada;


                const matchTexto = termo === "" || name.includes(termo) || comment.includes(termo);
                const matchRating = (!isNaN(rating) && rating >= minRating && rating <= maxRating);
                const matchVotes = (!isNaN(votes) && votes >= minVotes && votes <= maxVotes);
                const matchTrofeu =
                    trofeuSelecionado === "" ||
                    (trofeuSelecionado === "sem-trofeu" && !cardData.trofeu) ||
                    trofeu === trofeuSelecionado;


                if (matchTexto && matchRating && matchVotes && matchTrofeu && matchAvaliacao && matchYear) {
                    const card = createCard(cardData, key);
                    cardRow.appendChild(card);
                    resultados++;
                }
            });
            document.getElementById("filtro-contagem").textContent = `${resultados} card(s) encontrado(s).`;
        });

    }

    function parseVotes(v) {
        if (!v) return 0;
        v = v.toLowerCase().replace(",", ".").trim();
        if (v.includes("mil")) return parseFloat(v) * 1000;
        if (v.includes("k")) return parseFloat(v) * 1000;
        if (v.includes("m")) return parseFloat(v) * 1000000;
        return parseInt(v) || 0;
    }

    ["background-color1", "background-color2"].forEach(id => {
        document.getElementById(id).addEventListener("input", previewBackgroundColor);
    });

    // Pré-visualizar a cor de fundo
    function previewBackgroundColor() {
        const color1 = document.getElementById("background-color1").value;
        const color2 = document.getElementById("background-color2").value;

        // Pega o primeiro elemento com a classe "grid-container"
        var gridContainer = document.getElementsByClassName("grid-container")[0];

        if (color1 && color2 && color1 !== color2) {
            // Aqui você precisa criar o backgroundStyle antes de usar
            var backgroundStyle = `linear-gradient(to right, ${color1}, ${color2})`;
            // Agora sim aplica
            gridContainer.style.background = backgroundStyle;
        } else {
            // Aplicar cor sólida
            document.body.style.background = color1;
        }
    }

    function trocarLayout() {

        if (document.getElementById("wrapper2").classList.contains("hidden")) {
            document.getElementById("wrapper2").classList.remove("hidden");
            document.getElementById("wrapper1").classList.add("hidden");
        } else {
            document.getElementById("wrapper2").classList.add("hidden");
            document.getElementById("wrapper1").classList.remove("hidden");
        }

        const container = document.getElementById("sidebar-flip-container");
        botao.textContent = container.classList.contains("sidebar-flipped") ? "<<" : ">>";
    }

    function voltarParaHome() {
        location.reload(); // mesmo efeito do F5
    }

    function carregarCardsDoUsuarioAtual() {
        if (!currentUser) {
            console.warn("⚠️ currentUser está indefinido!");
            return;
        }
        meusCards = new Set();
        const categorias = ["animes", "filmes", "jogos", "kids", "livros", "series"];
        const promessas = categorias.map(categoria =>
            firebase.database().ref(`usuarios/${currentUser}/${categoria}`).once("value")
        );
        Promise.all(promessas).then(snapshots => {
            snapshots.forEach(snapshot => {
                const cards = snapshot.val();
                if (cards) {
                    Object.values(cards).forEach(card => {
                        const nome = normalizarTexto(card.name || "");
                        meusCards.add(nome);
                    });
                }
            });
        });
    }

    function verificarSeUsuarioTemCard(cardData, cardElement) {
        const userDisplay = document.getElementById('user-display');
        if (!userDisplay || !currentUser || !meusCards) return;
        const outroUsuario = userDisplay.textContent.trim();
        const nomeCard = (cardData.name || '').toLowerCase();
        if (currentUser != outroUsuario && meusCards.has(nomeCard)) {
            const aviso = document.createElement('div');
            aviso.textContent = '✅ Você já tem este card';
            aviso.classList.add('card-ja-tem');
            cardElement.style.position = 'relative';
            cardElement.appendChild(aviso);
        }
    }

    function normalizarTexto(texto) {
        return texto.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
    }