export const pixRanks = [
  { min: 0, name: "Novato", emoji: "🌑", color: "#A8A29E", gradient: "linear-gradient(135deg, #78716c, #292524)", theme: { accent: "#78716c", dark: "#44403c" } },
  { min: 100, name: "Cliente Plus", emoji: "💳", color: "#FBBF24", gradient: "linear-gradient(135deg, #f59e0b, #78350f)", theme: { accent: "#f59e0b", dark: "#92400e" } },
  { min: 500, name: "Lobo do Pix", emoji: "🐺", color: "#3B82F6", gradient: "linear-gradient(135deg, #3b82f6, #1e3a8a)", theme: { accent: "#3b82f6", dark: "#1d4ed8" } },
  { min: 2500, name: "Magnata Tech", emoji: "💻", color: "#EC4899", gradient: "linear-gradient(135deg, #db2777, #831843)", theme: { accent: "#ec4899", dark: "#be185d" } },
  { min: 10000, name: "Sócio do Dopamina", emoji: "🤝", color: "#10B981", gradient: "linear-gradient(135deg, #059669, #022c22)", theme: { accent: "#10b981", dark: "#047857" } },
  { min: 50000, name: "Rei do Cassino", emoji: "🎰", color: "#E85D3A", gradient: "linear-gradient(135deg, #e85d3a, #7f1d1d)", theme: { accent: "#e85d3a", dark: "#b91c1c" } },
  { min: 250000, name: "Dono de Tudo", emoji: "🌌", color: "#A855F7", gradient: "linear-gradient(135deg, #9333ea, #3b0764)", theme: { accent: "#a855f7", dark: "#6d28d9" } },
];

export const getPixRank = (totalSpent) => {
  let rank = pixRanks[0];
  for (const r of pixRanks) { if (totalSpent >= r.min) rank = r; }
  const nextIdx = pixRanks.indexOf(rank) + 1;
  const next = pixRanks[nextIdx] || null;
  const progress = next ? ((totalSpent - rank.min) / (next.min - rank.min)) * 100 : 100;
  return { ...rank, progress: Math.min(progress, 100), next };
};

export const categories = [
  { id: "gamer", name: "Área Gamer", emoji: "🎮", color: "#E85D3A" },
  { id: "masculino", name: "Área Masculina", emoji: "🧔", color: "#3B82F6" },
  { id: "feminino", name: "Área Feminina", emoji: "💃", color: "#EC4899" },
  { id: "lazer", name: "Área de Lazer", emoji: "🏖️", color: "#F59E0B" },
  { id: "alimentos", name: "Alimentos", emoji: "🍔", color: "#2D9F6F" },
  { id: "joias", name: "Joias Famosas", emoji: "💎", color: "#8B5CF6" },
  { id: "ilicitos", name: "Mercado Ilícito 🔞", emoji: "🕵️", color: "#000000" },
];

export const coupons = [
  { code: "BEMVINDO10", label: "10% na 1ª compra", discount: 0.10, type: "percent" },
  { code: "DOPA500", label: "D$ 500 OFF", discount: 500, type: "fixed" },
  { code: "FRETEGRATIS", label: "Frete Grátis", discount: 0, type: "frete" },
  { code: "SETUP20", label: "20% em setup", discount: 0.20, type: "percent" },
  { code: "GAMER15", label: "15% gamer", discount: 0.15, type: "percent" },
  { code: "DOPAMINA30", label: "30% de desconto!", discount: 0.30, type: "percent" },
  { code: "VIPMAX", label: "D$ 1.000 OFF!", discount: 1000, type: "fixed" },
  { code: "QUASEREAL", label: "5% quase real", discount: 0.05, type: "percent" },
];

export const trackingStages = [
  { label: "Pedido confirmado (por uma IA confusa)", emoji: "✅", minutesAfter: 0, location: "Shenzhen, China", lat: 22.5431, lng: 114.0579 },
  { label: "Pagamento aprovado (0,00 Dopas aceito)", emoji: "💳", minutesAfter: 1, location: "Guangzhou, China", lat: 23.1291, lng: 113.2644 },
  { label: "Produto separado por um robô preguiçoso", emoji: "🤖", minutesAfter: 3, location: "Hong Kong", lat: 22.3193, lng: 114.1694 },
  { label: "Embalado com carinho imaginário", emoji: "📦", minutesAfter: 5, location: "Singapura", lat: 1.3521, lng: 103.8198 },
  { label: "Saiu para entrega em universo paralelo", emoji: "🚀", minutesAfter: 10, location: "Oceano Índico", lat: -12.0, lng: 72.0 },
  { label: "Entregador fazendo lanche no caminho", emoji: "🍔", minutesAfter: 20, location: "Cidade do Cabo, África do Sul", lat: -33.9249, lng: 18.4241 },
  { label: "Quase chegando (ou não)", emoji: "🛵", minutesAfter: 40, location: "Oceano Atlântico", lat: -20.0, lng: -30.0 },
  { label: "Entregue! Mas só no metaverso 🥽", emoji: "🎉", minutesAfter: 60, location: "Seu Endereço", lat: -15.7801, lng: -47.9292 },
];


export const products = [
  { id:1, name:"Nvidia GeForce RTX 5090 ROG Strix 24GB", tag:"Pico de Dopamina", category:"gamer", oldPrice:18999, price: 1249900, rating:4.9, salesCount:1543, description:"A placa definitiva com arquitetura Blackwell.", image:"/rtx_5090.webp", specs:["24GB GDDR7","Blackwell","RT 4ª Gen","DLSS 4.0"], reviews:[
    {name:"Thiago S.",rating:5,date:"Ontem",comment:"Essa placa roda até o Microsoft Word em 4K 120fps. Meu PC saiu voando quando instalei, literalmente. Tá no telhado do vizinho."},
    {name:"Marcos W.",rating:5,date:"3 dias",comment:"Minha conta de luz triplicou mas meu ego quadruplicou. Vale cada centavo que eu não paguei."},
    {name:"Karen Gamer",rating:1,date:"1 semana",comment:"Comprei achando que era uma placa de vídeo mas veio uma placa de sinalização. 'Cuidado: curva perigosa'. Pelo menos decorei o quarto."},
    {name:"Juninho FPS",rating:5,date:"2 semanas",comment:"Antes eu viajava na maionese, agora eu viajo a 360 quadros por segundo. Chorem, consolistas."},
    {name:"Pedro Tech",rating:4,date:"3 semanas",comment:"Tão pesada que tive que escorar com um cabo de vassoura pra não quebrar a placa mãe. O design é rústico agora."},
    {name:"Dona Neide",rating:1,date:"1 mês",comment:"Meu neto pediu de Natal. Achei que era um fogão cooktop de 3 bocas pelos coolers gigantes. Não serviu pra fritar ovo."},
    {name:"Alexandre G.",rating:5,date:"1 mês",comment:"Vendi meu pálio 98 pra pagar a vista (brincadeira, foi fictício). Agora vou a pé pro trabalho mas o Ray Tracing no busão é top."},
    {name:"Camila R.",rating:5,date:"1 mês",comment:"Uso pra treinar IA e pra esquentar o quarto no inverno. Muito versátil 10/10."},
    {name:"Lucas V.",rating:2,date:"2 meses",comment:"A caixa é tão grande que minha mãe achou que eu tinha comprado uma geladeira. Decepcionou a coroa."},
    {name:"Ruanito",rating:5,date:"2 meses",comment:"Deixa o CS a 1500 fps. Eu clico e o boneco morre ontem. Impecável."}
  ]},
  { id:2, name:"PlayStation 5 Pro 2TB Edition", tag:"Mais Vendido", category:"gamer", oldPrice:7999, price: 589900, rating:4.8, salesCount:3412, description:"Fidelidade visual de outro nível.", image:"/ps5_pro_edition.webp", specs:["SSD 2TB","Ray Tracing","PSSR","8K"], reviews:[
    {name:"Gabriela S.",rating:5,date:"1 semana",comment:"O PS5 Pro é tão rápido que carregou meu jogo antes de eu decidir qual jogar. Agora tenho ansiedade de escolha."},
    {name:"Rodrigo A.",rating:4,date:"2 semanas",comment:"Console incrível. Minha esposa me deu um ultimato: ou ela ou o PS5. Sinto saudades dela às vezes."},
    {name:"Zé Ninguém",rating:2,date:"Ontem",comment:"Comprei pro meu filho mas agora ele não sai do quarto. Nem pra comer. Mandei comida por delivery dentro de casa."},
    {name:"Carlos D.",rating:5,date:"3 dias",comment:"Usei pra calçar a porta da sala porque é enorme, mas como roteador de internet tbm funciona bem. Brincadeira, é ótimo."},
    {name:"Sônia Maria",rating:1,date:"5 dias",comment:"Comprei achando que lia blu-ray pirata e não lê. Decepção. O leitor nem vem junto!"},
    {name:"Felipe C.",rating:5,date:"1 semana",comment:"Comprei só por causa do adesivo 'Pro'. Me sinto superior aos meus amigos com PS5 normal."},
    {name:"Anderson L.",rating:5,date:"2 semanas",comment:"Vendi meu rim, mas pelo menos rodo Spider-Man a 60fps com Ray Tracing. Prioridades."},
    {name:"Letícia",rating:4,date:"3 semanas",comment:"Muito branco, suja fácil. Pintei com spray preto e agora a Sony anulou minha garantia fictícia."},
    {name:"Matheus",rating:5,date:"1 mês",comment:"Diz que tem 8K na caixa. Não tenho TV 8K. Vou comprar uma TV imaginária também."},
    {name:"Paulo Sérgio",rating:5,date:"1 mês",comment:"Tão bonito que deixo desligado na estante só pra ostentar paras visitas."}
  ]},
  { id:3, name:"Monitor Curvo Odyssey OLED G9 49\"", tag:"Setup dos Sonhos", category:"gamer", oldPrice:12999, price: 849900, rating:4.9, salesCount:890, description:"Imersão total 49\" OLED 240Hz.", image:"/odyssey_g9.webp", specs:["32:9 Ultra-Wide","OLED","240Hz","0.03ms"], reviews:[
    {name:"Felipe M.",rating:5,date:"4 dias",comment:"Esse monitor é tão grande que meu gato dorme em cima. Ele pesa mais que minha mesa. Mas que imagem linda."},
    {name:"Ana Geek",rating:3,date:"1 semana",comment:"Veio sem os parafusos. Estou segurando com fita adesiva e fé. A imagem é linda, o suporte nem tanto."},
    {name:"Gustavo R.",rating:5,date:"2 semanas",comment:"Pra olhar de um lado pro outro eu preciso girar a cabeça. Fiz até fisioterapia pro pescoço."},
    {name:"Renato P.",rating:5,date:"3 semanas",comment:"Consigo abrir 48 abas do Excel simultaneamente e fingir que estou trabalhando muito."},
    {name:"Cláudia T.",rating:1,date:"1 mês",comment:"O brilho do OLED me cegou. Estou ditando esta avaliação pelo microfone. Não comprem se tiverem olhos sensíveis."},
    {name:"Bia Gamer",rating:5,date:"1 mês",comment:"Jogar corrida nisso aqui parece que estou no parabrisa do carro. Bati na parede do quarto tentanto desviar."},
    {name:"Arthur S.",rating:4,date:"1 mês",comment:"Quase tive que derrubar a parede do meu quarto pra caber a caixa. Mede antes de comprar, rapaziada."},
    {name:"Marcelo",rating:5,date:"2 meses",comment:"Comprei pra ver o feed do Instagram inteiro sem rolar a tela. Missão cumprida."},
    {name:"Livia",rating:2,date:"2 meses",comment:"Minha cabeça fica doendo de tanto virar de um lado pro outro. É muita informação."},
    {name:"Diego",rating:5,date:"3 meses",comment:"Simplesmente pica. Não tem o que falar. Pobre chora."}
  ]},
  { id:4, name:"Teclado Mecânico Custom RGB 75%", tag:"Satisfação Pura", category:"gamer", oldPrice:1499, price: 89900, rating:5.0, salesCount:2150, description:"Som terapêutico, switches cremosos.", image:"/images/1618384887929-16ec33fab9ef.webp", specs:["Switches Cremosos","75%","RGB","PBT Keycaps"], reviews:[
    {name:"Gustavo H.",rating:5,date:"Ontem",comment:"O som desse teclado curou minha insônia. Fico digitando 'aaaaaaa' só pra ouvir os cliques. Meu terapeuta aprovou."},
    {name:"Letícia B.",rating:5,date:"5 dias",comment:"Fiz ASMR com esse teclado e bombou no TikTok. 500 mil visualizações. O teclado fez mais pela minha carreira que minha faculdade."},
    {name:"João T.",rating:4,date:"1 semana",comment:"Luz pisca tanto que parece a balada de sábado. Minha avó achou que era uma nave alienígena."},
    {name:"Mariana",rating:5,date:"2 semanas",comment:"Switches tão cremosos que dá vontade de comer. Alguém sabe se faz mal engolir uma tecla?"},
    {name:"Carlos",rating:1,date:"3 semanas",comment:"Falta a porcaria do teclado numérico. Fui fazer imposto de renda e quase morri. Quem inventou 75%?"},
    {name:"Afonso",rating:5,date:"1 mês",comment:"Digitando essa avaliação nele. É tão suave que meus dedos estão deslizando thoc thoc thoc. Maravilhoso."},
    {name:"Bárbara",rating:4,date:"1 mês",comment:"Muito bom, mas meu colega de quarto ameaçou me expulsar se eu jogar de madrugada. Ele odeia o thock."},
    {name:"Lucas",rating:5,date:"2 meses",comment:"A cor do RGB aumentou meu FPS em 15%. É ciência, não discutam."},
    {name:"Fernanda",rating:3,date:"2 meses",comment:"Amei o design, mas as teclas são tão pesadas que ganhei músculos nos dedos. Tô parecendo um escalador."},
    {name:"Thiago",rating:5,date:"3 meses",comment:"Perfeito. O único defeito é que agora não consigo usar teclado de notebook sem chorar de desgosto."}
  ]},
  { id:5, name:"Grand Theft Auto VI — Edição Ultimate (PS5)", tag:"🔥 LANÇAMENTO", category:"gamer", oldPrice:699, price: 54990, rating:5.0, salesCount:99999, description:"Explore Leonida. Viva Vice City como nunca no PlayStation 5.", image:"/images/gta6-ultimate-ps5.webp", specs:["Exclusivo PS5","Mapa Gigante","Online","Steelbook"], reviews:[
    {name:"Todo mundo",rating:5,date:"Hoje",comment:"Esperei 12 anos por isso. Valeu cada segundo. Pedi demissão pra jogar. Sem arrependimentos."},
    {name:"Rockstar Fan",rating:5,date:"Hoje",comment:"Vice City tá tão realista que fui multado por dirigir na contramão DENTRO DO JOGO."},
    {name:"Mãe do Joãozinho",rating:1,date:"Hoje",comment:"Meu filho ficou 72 horas jogando sem parar. Já não sei mais a cor dos olhos dele. Quero reembolso emocional."},
    {name:"Fã Velha Guarda",rating:5,date:"Ontem",comment:"Finalmente posso nadar sem morrer instantaneamente como no Vice City do PS2."},
    {name:"Julio",rating:4,date:"2 dias",comment:"Jogo perfeito, mas a poça de água refletiu minha cara de cansado e me deu depressão. O Ray Tracing é cruel."},
    {name:"Amanda",rating:5,date:"3 dias",comment:"Adotei um jacaré de estimação no jogo. O nome dele é Jubileu. Melhor mecânica já inventada."},
    {name:"Carlos Eduardo",rating:5,date:"1 semana",comment:"A vida real perdeu a graça depois desse jogo. Os NPCs têm mais personalidade que meus colegas de trabalho."},
    {name:"Roberta",rating:2,date:"1 semana",comment:"Tentei assaltar o banco e a polícia me prendeu. No jogo e na vida real a impunidade não existe mais."},
    {name:"Gamer Ansioso",rating:5,date:"2 semanas",comment:"Fiquei sem piscar por 8 horas. Precisei de colírio. Mas platinei a primeira área."},
    {name:"Zé das Couves",rating:5,date:"3 semanas",comment:"Comprei, não tenho console pra jogar, mas deixo a capinha exposta na sala como relíquia sagrada."}
  ]},
  { id:80, name:"Grand Theft Auto VI — Edição Ultimate (Xbox Series X)", tag:"🔥 LANÇAMENTO", category:"gamer", oldPrice:699, price: 54990, rating:5.0, salesCount:84500, description:"Explore Leonida. Viva Vice City como nunca no Xbox Series X.", image:"/images/gta6-ultimate-xbox.webp", specs:["Exclusivo Xbox","Mapa Gigante","Online","Steelbook"], reviews:[
    {name:"Gamer Verde",rating:5,date:"Hoje",comment:"Esperei muito pra jogar isso no meu Xbox. Valeu a pena demais."},
    {name:"Lucas",rating:5,date:"Ontem",comment:"O quick resume no Xbox com GTA 6 é a melhor coisa que inventaram."}
  ]},
  { id:81, name:"Grand Theft Auto VI — Edição Padrão (PS5)", tag:"🔥 LANÇAMENTO", category:"gamer", oldPrice:499, price: 44990, rating:4.9, salesCount:150000, description:"A edição básica do jogo mais aguardado do século.", image:"/images/gta6-padrao-ps5.webp", specs:["Exclusivo PS5","Jogo Base","Mídia Física","Online"], reviews:[
    {name:"Pobre Gamer",rating:5,date:"Hoje",comment:"Queria a ultimate mas a grana só deu pra padrão (de mentira). O jogo é brabo mesmo assim."},
    {name:"José",rating:5,date:"1 semana",comment:"Chegou rápido, capa bonita, disco perfeito."}
  ]},
  { id:6, name:"GTA VI — Collector's Edition + Mapa Físico", tag:"Edição Colecionador", category:"gamer", oldPrice:999, price: 69900, rating:4.9, salesCount:5420, description:"Steelbook, mapa tecido e arte exclusiva.", image:"/gta6_collectors.webp", specs:["Steelbook","Mapa Tecido","Art Book","DLC"], reviews:[
    {name:"Pedro K.",rating:5,date:"2 dias",comment:"O mapa de tecido é tão bonito que emoldurei e coloquei na sala. Minha mãe acha que é arte moderna."},
    {name:"Thiago H.",rating:5,date:"1 semana",comment:"A estátua que vem junto é mais detalhada que a minha própria cara. Magnífico."},
    {name:"Letícia M.",rating:4,date:"1 semana",comment:"Comprei achando que a bolsa era de couro de verdade, mas é plástico vegano. Pelo menos salvei os jacarés de Leonida."},
    {name:"Lucas Br",rating:5,date:"2 semanas",comment:"Cheiro de papel novo do artbook me deu tontura de tão bom. Sou viciado nisso."},
    {name:"Marta",rating:1,date:"3 semanas",comment:"O entregador roubou minha edição de colecionador. Ironia do destino, logo com GTA. Parabéns aos envolvidos."},
    {name:"Vinicius",rating:5,date:"1 mês",comment:"Paguei quase mil conto (de mentira) numa caixa de papelão chique. Zero arrependimentos."},
    {name:"Gabriel",rating:5,date:"1 mês",comment:"A trilha sonora no vinil é um espetáculo. Pena que eu não tenho toca-discos. Boto no Spotify olhando pro vinil."},
    {name:"Juliana",rating:4,date:"2 meses",comment:"Muito legal mas a estátua é meio pesada. Quase quebrei meu pé quando deixei cair."},
    {name:"Ricardo",rating:5,date:"2 meses",comment:"É tão exclusivo que nem abri o plástico ainda. Meu investimento pro futuro. Vou vender no mercado livre por 5 milhões em 2040."},
    {name:"João O.",rating:5,date:"3 meses",comment:"Coleção completa. Agora minha estante parece o altar de uma religião chamada Rockstar."}
  ]},
  { id:7, name:"Relógio Rolex Submariner Black Gold", tag:"Luxo Absoluto", category:"masculino", oldPrice:89999, price: 6999900, rating:4.9, salesCount:120, description:"O relógio mais icônico do mundo.", image:"/images/1523170335258-f5ed11844a49.webp", specs:["Automático","300m","Oystersteel","Cerâmica"], reviews:[
    {name:"Ricardo M.",rating:5,date:"1 semana",comment:"Comprei o Rolex e agora o Uber me chama de 'senhor'. O porteiro do prédio me cumprimenta. Mudou minha vida social."},
    {name:"Zé Ostentação",rating:5,date:"3 dias",comment:"Pago D$ 0,00 num Rolex. Melhor custo-benefício da história da humanidade."},
    {name:"Paulo R.",rating:4,date:"2 semanas",comment:"É pesadão. Fiquei com o braço esquerdo mais forte que o direito. Academia grátis."},
    {name:"Maurício",rating:1,date:"1 mês",comment:"Mergulhei até 300m e ele parou de funcionar. Mentira, tomei banho de chuveiro quente e embaçou. Devolvi."},
    {name:"Fernando",rating:5,date:"1 mês",comment:"Minha mulher achou que eu tava roubando banco pra comprar isso. Não expliquei que o site era fictício. Tá me tratando como rei."},
    {name:"Lucas",rating:5,date:"2 meses",comment:"Brilha tanto no sol que reflete no olho do motorista da frente e ele bate o carro. Poder perigoso."},
    {name:"Marcos",rating:4,date:"2 meses",comment:"Fica lindo no pulso, mas toda hora alguém pergunta as horas e eu só comprei pelo visual, nem sei ler relógio de ponteiro."},
    {name:"Eduardo",rating:5,date:"3 meses",comment:"Entrei na loja da Rolex com esse no braço e o gerente me ofereceu champanhe. Me senti o Batman."},
    {name:"Carlos",rating:5,date:"4 meses",comment:"Uso até pra dormir. Se eu morrer dormindo quero estar bem vestido."},
    {name:"Henrique",rating:3,date:"5 meses",comment:"Muito caro (no mundo real). No Dopashop é perfeito. Comprei 3, um pra cada cachorro também."}
  ]},
  { id:8, name:"Perfume Dior Sauvage Elixir 100ml", tag:"Best Seller", category:"masculino", oldPrice:899, price: 64900, rating:4.8, salesCount:4300, description:"Intensidade magnética.", image:"/dior_sauvage.webp", specs:["100ml","Elixir","12h+","Amadeirado"], reviews:[
    {name:"Lucas A.",rating:5,date:"3 dias",comment:"Passei no trabalho e 3 pessoas perguntaram que perfume era. Uma delas era meu chefe. Fui promovido."},
    {name:"João Romance",rating:4,date:"1 semana",comment:"Borrifei no travesseiro, agora eu mesmo estou apaixonado por mim. Autoestima nas alturas."},
    {name:"Fábio",rating:5,date:"2 semanas",comment:"O cheiro dura tanto que eu tomei 4 banhos e continuo cheirando a milionário sedutor."},
    {name:"Vagner",rating:1,date:"1 mês",comment:"Usei no elevador e uma velha começou a tossir e quase morreu sufocada. Projeção monstra, empatia zero."},
    {name:"Daniel",rating:5,date:"1 mês",comment:"Fui no mercado de chinelo e pijama mas o cheiro de Sauvage me fez ser tratado como cliente vip."},
    {name:"Roberto",rating:5,date:"2 meses",comment:"Passei no meu cachorro e agora as cadelas do bairro fazem fila no meu portão. Johnny Depp estava certo."},
    {name:"Alex",rating:4,date:"2 meses",comment:"Muito forte, coloquei duas borrifadas e criei uma neblina no quarto. Rendimento vitalício."},
    {name:"Bruno",rating:5,date:"3 meses",comment:"A tampa de imã é viciante. Fico abrindo e fechando de tédio. Melhor fidget spinner de 600 Dopas."},
    {name:"Mateus",rating:5,date:"4 meses",comment:"Se você quer chamar atenção da morena, é esse. Se não der certo, o problema é sua cara mesmo."},
    {name:"Thiago",rating:3,date:"5 meses",comment:"Cheiro de macho alfa. Infelizmente sou beta, então a dissonância cognitiva tá forte."}
  ]},
  { id:9, name:"Tênis Nike Air Jordan 1 Retro Chicago", tag:"Clássico", category:"masculino", oldPrice:1999, price: 129900, rating:4.9, salesCount:2800, description:"O tênis que mudou o streetwear.", image:"/images/1556906781-9a412961c28c.webp", specs:["Couro","OG","Cano Alto","Limitado"], reviews:[
    {name:"André S.",rating:5,date:"5 dias",comment:"Comprei e não consigo usar porque tenho medo de sujar. Ficam na prateleira. Eu olho pra eles todo dia."},
    {name:"Caio",rating:5,date:"1 semana",comment:"Calcei e minha habilidade no basquete continuou horrível, mas pelo menos sou o pior jogador mais estiloso da quadra."},
    {name:"Victor",rating:4,date:"2 semanas",comment:"O couro é tão vermelho que os touros me encaram na rua. Estilo perigoso, literalmente."},
    {name:"João V.",rating:1,date:"1 mês",comment:"Apertou meu mindinho de um jeito que precisei amputar. Mentira, mas doeu. Jordan, arruma essa forma aí."},
    {name:"Matheus",rating:5,date:"1 mês",comment:"Cheiro de couro de tênis novo é melhor que qualquer perfume importado. Passo o dia snifando a caixa."},
    {name:"Rodrigo",rating:5,date:"2 meses",comment:"Pisei numa poça d'água no primeiro dia de uso. Cai de joelhos e chorei aos prantos no meio da rua."},
    {name:"Diego",rating:5,date:"2 meses",comment:"Combina com terno? Não. Eu uso com terno no escritório mesmo assim? Sim. Alguém reclamou? Não, eles respeitam o drip."},
    {name:"Felipe",rating:4,date:"3 meses",comment:"Muito difícil de calçar, tenho que desamarrar tudo e passar 10 minutos ajustando. A beleza exige sacrifícios diários."},
    {name:"Gabriel",rating:5,date:"4 meses",comment:"Michael Jordan aprovaria. Se ele visse que paguei nada no Dopashop ele ia ficar louco."},
    {name:"Leandro",rating:5,date:"5 meses",comment:"Ícone máximo. A cada passo me sinto andando na lua. Perfeição materializada."}
  ]},
  { id:10, name:"Bolsa Louis Vuitton Neverfull MM", tag:"Ícone Fashion", category:"feminino", oldPrice:14999, price: 1199900, rating:5.0, salesCount:560, description:"Canvas monogram, interior rosa.", image:"/images/1584917865442-de89df76afd3.webp", specs:["Monogram","Rosa","Pochette","France"], reviews:[
    {name:"Camila R.",rating:5,date:"2 dias",comment:"Bolsa linda! Cabe minha vida inteira dentro. Literalmente. Celular, carteira, marmita, guarda-chuva e um gatinho."},
    {name:"Diva do Brás",rating:1,date:"Ontem",comment:"A bolsa veio com cheiro de croissant. Não sei se é bug ou feature. Mas tô adorando."},
    {name:"Patrícia",rating:5,date:"1 semana",comment:"Uso pra carregar tijolos na obra. O pessoal respeita o mestre de obras com Louis Vuitton."},
    {name:"Fernanda",rating:4,date:"2 semanas",comment:"Neverfull é mentira. Eu consegui encher ela até a borda na Black Friday. Quero reembolso por propaganda enganosa."},
    {name:"Laura",rating:5,date:"1 mês",comment:"As invejosas do trabalho ficaram em choque quando cheguei. O preço da minha paz foi 0,00 Dopas no DopaShop."},
    {name:"Sofia",rating:5,date:"1 mês",comment:"É tão espaçosa que as vezes meu celular toca lá dentro e demora 5 dias úteis pra eu encontrar ele."},
    {name:"Alice",rating:3,date:"2 meses",comment:"As alças machucam o ombro se colocar uma melancia dentro. Devia ser mais acolchoada pra feira."},
    {name:"Beatriz",rating:5,date:"3 meses",comment:"O monograma é clássico. Nunca sai de moda. Vou deixar de herança pra minha poodle."},
    {name:"Mariana",rating:5,date:"4 meses",comment:"Uso no mercado. A cara da caixa passando a mortadela enquanto olha minha LV é impagável."},
    {name:"Juliana",rating:5,date:"5 meses",comment:"Qualidade impecável. As costuras não soltam nem se o cachorro morder (ele tentou). Nota 10."}
  ]},
  { id:11, name:"Perfume Chanel N°5 L'Eau 100ml", tag:"Elegância Eterna", category:"feminino", oldPrice:1299, price: 99900, rating:4.9, salesCount:3200, description:"A fragrância mais famosa do mundo.", image:"/images/1541643600914-78b084683601.webp", specs:["100ml","EDT","Cítricas","Icônico"], reviews:[
    {name:"Isabela F.",rating:5,date:"1 semana",comment:"Botei uma gota e meu crush me mandou mensagem depois de 6 meses. Perfume milagroso ou coincidência? Não importa."},
    {name:"Marina",rating:5,date:"2 semanas",comment:"Marilyn Monroe só dormia com umas gotas disso. Eu tentei e dormi muito cheirosa, mas acordei descabelada do mesmo jeito."},
    {name:"Clara",rating:1,date:"3 semanas",comment:"Minha mãe disse que eu tô com cheiro de vó rica. Eu tenho 22 anos. Não sei se agradeço ou choro."},
    {name:"Renata",rating:5,date:"1 mês",comment:"Cheiro de limpeza, sabão caro, mulher independente que não depende de homem pra comprar suas joias falsas. Amei."},
    {name:"Helena",rating:4,date:"1 mês",comment:"A fixação é tão boa que mesmo lavando a roupa 3 vezes o Chanel não sai. Parece um encosto luxuoso."},
    {name:"Leticia",rating:5,date:"2 meses",comment:"Me sinto andando nas ruas de Paris, mesmo pegando o BRT lotado 6 da manhã."},
    {name:"Vitoria",rating:5,date:"3 meses",comment:"Comprei pra deixar no banheiro e mostrar pra visita. O banheiro mais cheiroso do bairro inteiro."},
    {name:"Amanda",rating:5,date:"4 meses",comment:"O frasco é a coisa mais minimalista e chique que existe. Parece um bloco de gelo precioso."},
    {name:"Carolina",rating:4,date:"4 meses",comment:"Arde os olhos se espirrar perto do rosto. Aviso de segurança importante. Fiquei 1 hora cega e cheirosa."},
    {name:"Silvia",rating:5,date:"5 meses",comment:"Atemporal. Quem acha que é cheiro de velha não tem classe. É cheiro de história."}
  ]},
  { id:12, name:"Paleta Charlotte Tilbury Pillow Talk", tag:"Viral TikTok", category:"feminino", oldPrice:499, price: 37900, rating:4.8, salesCount:7800, description:"A paleta viral com tons rosados luxuosos.", image:"/images/1596462502278-27bfdc403348.webp", specs:["12 Tons","Acetinado","Alta Pigmentação","Cruelty Free"], reviews:[
    {name:"Juliana M.",rating:5,date:"Ontem",comment:"Fiz a make e minha mãe não me reconheceu. Achei que era elogio até ela fechar a porta na minha cara."},
    {name:"Bruna",rating:5,date:"1 semana",comment:"As cores esfumam sozinhas. Eu só fecho o olho, passo o pincel e abro parecendo a Gisele Bündchen."},
    {name:"Thais",rating:4,date:"2 semanas",comment:"Comprei porque vi no TikTok. Não sei me maquiar, fiquei parecendo um panda rosa, mas a culpa é minha, o produto é 10."},
    {name:"Larissa",rating:1,date:"1 mês",comment:"Deixei cair no chão e quebrou o tom mais bonito. Chorei em posição fetal. A embalagem devia ser de titânio pra desastrados."},
    {name:"Natália",rating:5,date:"1 mês",comment:"Cores lindas para o dia a dia. Chega de usar sombra azul dos anos 90, finalmente descobri os neutros."},
    {name:"Priscila",rating:5,date:"2 meses",comment:"Vale o hype. A embalagem dourada é a coisa mais chique da minha penteadeira do Mercado Livre."},
    {name:"Luiza",rating:4,date:"2 meses",comment:"O pó brilha tanto que dá pra sinalizar pra aviões na rua se usar no sol. Muito iluminado."},
    {name:"Marcela",rating:5,date:"3 meses",comment:"Esfumar isso é mais fácil que arrumar desculpa pra não ir na academia. Perfeito."},
    {name:"Joana",rating:5,date:"4 meses",comment:"Dura a noite toda. Saí de casa princesa, voltei bêbada e amassada, mas a sombra tava intacta!"},
    {name:"Raquel",rating:5,date:"5 meses",comment:"Pigmentação surreal. Um pouquinho de produto já pinta a cara inteira. Vai durar 5 anos."}
  ]},
  { id:13, name:"Drone DJI Air 3 Câmera Dual 4K", tag:"Aventura Aérea", category:"lazer", oldPrice:8999, price: 649900, rating:4.8, salesCount:940, description:"Cinematográfico, 46 min de voo.", image:"/images/1507582020474-9a35b7d455d9.webp", specs:["Dual 4K","46 Min","Anti-Colisão","20km"], reviews:[
    {name:"Rafael T.",rating:5,date:"3 dias",comment:"Filmei meu vizinho sem querer e descobri que ele tem uma piscina secreta. Agora somos melhores amigos."},
    {name:"Dona Maria",rating:2,date:"1 semana",comment:"O drone voou pro vizinho e não voltou. Acho que gostou mais de lá."},
    {name:"Carlos Piloto",rating:5,date:"2 semanas",comment:"Os sensores funcionam perfeitamente. Tentei jogar na parede de propósito e ele parou 2 cm antes. Drone esperto."},
    {name:"Sérgio",rating:1,date:"1 mês",comment:"Fui gravar um casamento e um pombo atacou o drone. Perdi a câmera e o noivo quase infartou. Não recomendo pra área com pombos raivosos."},
    {name:"Bruno",rating:5,date:"1 mês",comment:"Imagens cinematográficas! Fui filmar minha ida na padaria e parecia o trailer do novo Missão Impossível."},
    {name:"Marcos",rating:4,date:"2 meses",comment:"Bateria é ótima. Deu tempo de voar até o parque, assustar as pombas e voltar antes do aviso de bateria fraca."},
    {name:"Victor",rating:5,date:"2 meses",comment:"Comprei pra espionar se minha esposa tava comendo doce escondido. A câmera 4K capturou farelos de Bis na boca dela. A verdade foi revelada."},
    {name:"Fábio",rating:5,date:"3 meses",comment:"Estabilidade em ventos fortes é absurda. Tinha um furacão lá fora e o bicho parado no ar igual chumbo."},
    {name:"Eduardo",rating:4,date:"4 meses",comment:"Ótimo produto, mas os vizinhos acham que eu tô espionando eles toda vez que ligo. Problemas sociais."},
    {name:"Leonardo",rating:5,date:"5 meses",comment:"Profissional. Ganho a vida tirando foto de telhado furado pras imobiliárias. Dinheiro fácil graças a isso aqui."}
  ]},
  { id:14, name:"Caixa de Som JBL PartyBox Encore", tag:"Festa Garantida", category:"lazer", oldPrice:2499, price: 179900, rating:4.7, salesCount:3100, description:"100W com luzes LED.", image:"/images/1608043152269-423dbba4e7e1.webp", specs:["100W","LED","BT 5.3","Mic"], reviews:[
    {name:"Bruno C.",rating:5,date:"1 semana",comment:"Liguei no máximo e o síndico me ligou em 3 segundos. Record mundial. Valeu cada reclamação."},
    {name:"Tadeu",rating:4,date:"2 semanas",comment:"O grave é tão forte que derrubou os porta-retratos da estante. Tive que colar a foto da minha mãe de volta no vidro."},
    {name:"Vanderson",rating:5,date:"1 mês",comment:"Levei pra praia e viciei todos os banhistas num remix de forró com psy trance. Rei da areia."},
    {name:"Aline",rating:1,date:"1 mês",comment:"O LED brilha mais que farol alto de caminhonete na rodovia. Tive que colocar óculos escuros dentro de casa."},
    {name:"Roberto",rating:5,date:"2 meses",comment:"O microfone é show! Minha família toda me odeia agora porque eu não paro de cantar Evidências no karaokê."},
    {name:"Thiago",rating:5,date:"2 meses",comment:"Perfeita pro churrascão. O som não distorce nem no volume máximo, a carne até assa melhor com os graves."},
    {name:"Luiz",rating:4,date:"3 meses",comment:"Bateria dura bem, mas é pesada demais. Fui carregar por dois quarteirões e meu braço esquerdo hipertrofiou."},
    {name:"Mirella",rating:5,date:"4 meses",comment:"Comprei pra ouvir música no banho. O banheiro virou a boate mais exclusiva da cidade. Entrada VIP pra mim e meu shampoo."},
    {name:"José",rating:5,date:"5 meses",comment:"Qualidade JBL não tem jeito. Os leds sincronizam com a batida, e se você tocar pagode as luzes começam a sambar."},
    {name:"Wagner",rating:3,date:"5 meses",comment:"Volume é alto, mas perdi a caixa no parque e alguém achou antes de mim. Triste. Pelo menos saiu barato no DopaShop."}
  ]},
  { id:15, name:"GoPro HERO 13 Black Creator", tag:"Aventureiro", category:"lazer", oldPrice:4999, price: 349900, rating:4.9, salesCount:1800, description:"5.3K com HyperSmooth 7.0.", image:"/images/1564466809058-bf4114d55352.webp", specs:["5.3K","HyperSmooth","10m Água","Creator Kit"], reviews:[
    {name:"Mariana L.",rating:5,date:"4 dias",comment:"Filmei minha cachorra correndo e ficou melhor que qualquer filme do Marvel. Ela merece um Oscar."},
    {name:"Radical123",rating:5,date:"1 semana",comment:"Coloquei no capacete pra pular de paraquedas. Descobri que tenho uma cara horrível com o vento a 200km/h. A câmera é top, eu que sou feio."},
    {name:"Gustavo",rating:4,date:"2 semanas",comment:"Mergulhei no mar e perdi ela. A estabilização de imagem deve estar filmando os peixes em 5.3K liso. Alguém acha por mim?"},
    {name:"Amanda",rating:5,date:"1 mês",comment:"O modo slow-motion é irreal. Filmei meu namorado espirrando e virou um documentário da National Geographic."},
    {name:"Felipe",rating:1,date:"1 mês",comment:"O microfone captou meu grito de pânico na montanha russa com perfeição cristalina. Vergonha HD pra posteridade."},
    {name:"Renan",rating:5,date:"2 meses",comment:"Bateria aguenta bem se você não ligar o Wi-Fi, o GPS, a tela e não gravar. Brincadeira, dura bastante sim!"},
    {name:"Julia",rating:5,date:"3 meses",comment:"Uso pra gravar receita de bolo. Sim, comprei uma câmera de esportes radicais pra ver a massa crescendo. Problema é meu."},
    {name:"Arthur",rating:4,date:"4 meses",comment:"Acessórios custam um rim separadamente. O bom do Creator Kit é que já vem com quase tudo. Muito brabo."},
    {name:"Ricardo",rating:5,date:"4 meses",comment:"Travei ela no peito no show de metal. Fiquei no Mosh Pit. O vídeo saiu tão estável que parece que eu tava parado assistindo. Mágica negra."},
    {name:"Pedro",rating:5,date:"5 meses",comment:"Top! HyperSmooth 7.0 te faz parecer um cineasta mesmo tendo mal de parkinson nas mãos."}
  ]},
  { id:16, name:"Kit Wagyu A5 Japonês 1kg", tag:"Gourmet Premium", category:"alimentos", oldPrice:2999, price: 199900, rating:5.0, salesCount:340, description:"Autêntico Wagyu A5 de Kobe.", image:"/images/1546833999-b9f581a1996d.webp", specs:["Wagyu A5","1kg","Refrigerado","Kobe"], reviews:[
    {name:"Chef Ricardo",rating:5,date:"2 dias",comment:"Essa carne derreteu na minha boca E na minha carteira. Ah espera, não paguei nada. Melhor dia da minha vida."},
    {name:"Vegano Arrependido",rating:5,date:"Ontem",comment:"Voltei a comer carne por causa desse Wagyu. Desculpa, vacas."},
    {name:"Mestre Churrasqueiro",rating:1,date:"1 semana",comment:"Fui assar no espeto na churrasqueira de tijolo e a carne pingou tanta gordura que fiz uma fogueira de 2 metros e queimei os cílios."},
    {name:"Patrícia",rating:5,date:"2 semanas",comment:"Tão macia que eu dei pra minha avó banguela comer e ela nem precisou mastigar. Sucesso absoluto no domingo."},
    {name:"GourmetSP",rating:5,date:"1 mês",comment:"Não coloque ketchup nisso pelo amor de Deus. Sal e fogo, só. É uma experiência religiosa."},
    {name:"Carioca",rating:4,date:"1 mês",comment:"Muito boa, mas o preço original paga meu aluguel 3 vezes. No DopaShop eu compro e ostento todo dia pro vizinho."},
    {name:"Junior",rating:5,date:"2 meses",comment:"Mais gordura marmorizada que proteína. Você está basicamente comendo manteiga bovina saborosa. Cuidado com o colesterol imaginário."},
    {name:"Aline",rating:5,date:"3 meses",comment:"Usei pra fazer estrogonofe. Brincadeira, o chef chorou lendo isso. Grelhei na chapa quente, ficou de deuses."},
    {name:"Márcio",rating:5,date:"4 meses",comment:"Você descobre que foi enganado a vida toda achando que fraldinha era macia. O Wagyu é um abraço quente no paladar."},
    {name:"Daniel",rating:4,date:"5 meses",comment:"Come um pedaço e tá cheio porque é absurdamente rico e gorduroso. Não aguenta comer 1kg sozinho nem se for um ogro."}
  ]},
  { id:17, name:"Chocolates Belgas Godiva 36un", tag:"Presente Perfeito", category:"alimentos", oldPrice:599, price: 39900, rating:4.9, salesCount:5200, description:"Trufas e pralinés artesanais.", image:"/images/1549007994-cb92caebd54b.webp", specs:["36un","Trufas","Caixa Presente","Bélgica"], reviews:[
    {name:"Ana Paula",rating:5,date:"Ontem",comment:"Comi os 36 num dia só e não me arrependo de nada. Minha nutricionista que lute."},
    {name:"Rodrigo Amoroso",rating:5,date:"1 semana",comment:"Dei pra minha sogra. Ela parou de reclamar de mim por exatamente 45 minutos. Pior que foi um milagre, vou comprar mais caixas mensais."},
    {name:"Formiga",rating:5,date:"2 semanas",comment:"Isso não é chocolate, é pedaço do céu embalado na Bélgica. Nunca mais como biscoito recheado de supermercado."},
    {name:"Carlos",rating:1,date:"1 mês",comment:"Esqueci no sol dentro do carro. Virou uma poça única de chocolate belga de 400 Dopas. Comi de colher, não perdi a pose."},
    {name:"Juliana",rating:5,date:"1 mês",comment:"A caixa é dourada chiquérrima. Dá até pena de jogar fora. Tô usando pra guardar conta de luz pra fingir que tenho classe."},
    {name:"Marcela",rating:4,date:"2 meses",comment:"Tem uns recheios estranhos de maracujá com flor do Himalaia que não entendi muito, mas a maioria é deliciosa."},
    {name:"Bruno",rating:5,date:"3 meses",comment:"Um único bombom desses resolveu minha crise existencial de terça-feira. Dopamina líquida na veia."},
    {name:"Fernanda",rating:5,date:"4 meses",comment:"Presente infalível pra qualquer esposa brava. Compre sem medo, é a bandeira branca da paz."},
    {name:"Gabriel",rating:5,date:"4 meses",comment:"Derrete na boca de um jeito surreal. O gosto fica lá por um bom tempo, muito intenso."},
    {name:"Luisa",rating:5,date:"5 meses",comment:"É tão caro que eu como mordendo pedacinhos microscópicos de rato de porão pra render mais o sabor."}
  ]},
  { id:18, name:"Whisky Macallan 18 Years 700ml", tag:"Colecionável", category:"alimentos", oldPrice:3999, price: 279900, rating:4.9, salesCount:620, description:"Single Malt 18 anos Sherry Oak.", image:"/images/1569529465841-dfecdab7503b.webp", specs:["18 Anos","Sherry Oak","700ml","Highland"], reviews:[
    {name:"Fernando G.",rating:5,date:"1 semana",comment:"Cada gole desse whisky me faz sentir que sou rico. A ilusão dura até acabar a garrafa."},
    {name:"Bebedor Elite",rating:5,date:"2 semanas",comment:"Misturei com refrigerante de cola e o espírito de um escocês apareceu na sala pra me xingar em gaélico. Desculpa, mundo."},
    {name:"Tiozão",rating:5,date:"1 mês",comment:"O líquido é ouro engarrafado. Desce rasgando o pescoço mas abraçando o coração. Coisa fina, patrão."},
    {name:"Cíntia",rating:1,date:"1 mês",comment:"Meu marido disse que ia comprar um carro, descobri que comprou essa garrafa de suco de mato fermentado. Quero o divórcio imaginário."},
    {name:"Roberto",rating:5,date:"2 meses",comment:"Serviço em taça de cristal. Fechei os olhos e vi as colinas da Escócia e o Monstro do Lago Ness me acenando. Pode ter sido o álcool, mas ok."},
    {name:"Arthur",rating:4,date:"3 meses",comment:"Muito bom. Tão bom que dá dó de beber. O vidro tá na estante pegando pó há um ano porque todo dia não parece 'especial o suficiente'."},
    {name:"João S.",rating:5,date:"3 meses",comment:"A rolha cheira a madeira envelhecida, o copo cheira a sucesso financeiro. Comprei dois pra garantir."},
    {name:"Maurício",rating:5,date:"4 meses",comment:"A ressaca desse whisky é educada. Você acorda e sua dor de cabeça pede 'com licença, senhor'. Totalmente diferenciado."},
    {name:"Guilherme",rating:5,date:"5 meses",comment:"Bebida pra sentar numa poltrona de couro usando um roupão, com charuto na boca. Harvey Specter feelings."},
    {name:"Renato",rating:4,date:"6 meses",comment:"Incrível, mas por esse preço devia vir acompanhado de um irlandês dançarino tocando gaita de foles na entrega."}
  ]},
  { id:19, name:"Anel Tiffany & Co. Setting 1ct", tag:"Noivado dos Sonhos", category:"joias", oldPrice:89999, price: 7499900, rating:5.0, salesCount:210, description:"Diamante 1ct com 6 garras Tiffany.", image:"/images/1605100804763-247f67b3557e.webp", specs:["1ct","Platina","6 Garras","GIA"], reviews:[
    {name:"Patricia V.",rating:5,date:"3 dias",comment:"Ela disse SIM! Depois descobriu que foi 0,00 Dopas e disse NÃO. Mas o anel é lindo."},
    {name:"Solteiro Forever",rating:5,date:"Ontem",comment:"Comprei pra mim mesmo. Me pedi em casamento no espelho. Aceitei. Cerimônia linda."},
    {name:"Lucas",rating:4,date:"1 semana",comment:"Brilha tanto que quase perdi a visão usando no sol forte sem óculos escuros."},
    {name:"Ana Beatriz",rating:5,date:"2 semanas",comment:"A famosa caixinha azul. Quando o entregador chegou eu já desabei a chorar achando que era pedido do motoboy."},
    {name:"Felipe Romance",rating:5,date:"1 mês",comment:"Pedi a mão dela na Torre Eiffel. Ela não prestou atenção na torre, só no anel. Dinheiro (fictício) bem gasto."},
    {name:"Carol",rating:1,date:"1 mês",comment:"Meu noivo perdeu no ralo da pia no segundo dia. Tivemos que destruir o encanamento do prédio. A vizinha nos odeia agora."},
    {name:"Juliana",rating:5,date:"2 meses",comment:"O design das 6 garras levanta a pedra e faz ela parecer um holofote de cruzeiro na mão. Sensacional."},
    {name:"Marcos P.",rating:5,date:"3 meses",comment:"Fui avaliado por um joalheiro e ele chorou abraçado na pedra. Acho que o diamante era bom mesmo."},
    {name:"Livia",rating:5,date:"4 meses",comment:"Me sinto a Audrey Hepburn comendo pão na frente do site. Clássico, maravilhoso."},
    {name:"Rodrigo",rating:4,date:"5 meses",comment:"Vem com certificado e tudo, pena que na vida real eu ando de busão. Mas a noiva ficou muito feliz."}
  ]},
  { id:20, name:"Colar Cartier Love Ouro 18K", tag:"Luxo Cartier", category:"joias", oldPrice:45999, price: 3899900, rating:4.9, salesCount:380, description:"Icônico Love com 2 diamantes.", image:"/cartier_love.webp", specs:["Ouro 18K","2 Diamantes","42cm","Caixa Cartier"], reviews:[
    {name:"Renata S.",rating:5,date:"5 dias",comment:"O colar é tão bonito que durmo com ele. Meu marido está com ciúmes de uma joia. Tempos modernos."},
    {name:"João Gado",rating:5,date:"1 semana",comment:"Comprei depois de uma briga enorme com a patroa. Fui perdoado antes mesmo de ela abrir a caixa vermelha."},
    {name:"Camila",rating:4,date:"2 semanas",comment:"Muito chic, mas o fecho é chatinho de abrir sozinha. Tive que bater na porta do vizinho pra me ajudar. Agora tamo namorando. Cartier unindo pessoas."},
    {name:"Sabrina",rating:5,date:"1 mês",comment:"A pulseira clássica dá problema no raio x do aeroporto, então o colar é bem mais prático de ostentar em viagens."},
    {name:"Victor",rating:5,date:"2 meses",comment:"Eu nem gosto de usar ouro, mas esse treco é hipnotizante. Toda vez que olho no espelho solto um beijo pra mim mesmo."},
    {name:"Aline",rating:1,date:"3 meses",comment:"A caixa vermelha veio amassada na pontinha. Pelo valor fictício pago eu exijo a perfeição geométrica dos ângulos. Fora isso, é lindo."},
    {name:"Marcela",rating:5,date:"3 meses",comment:"Tem um peso diferente do ouro normal, você sente a riqueza repousando na clavícula o dia todo. Recomendo."},
    {name:"Thiago",rating:4,date:"4 meses",comment:"Os 2 diamantes são bem pequenos, mas brilham de um jeito desproporcional pro tamanho. Magia da Cartier."},
    {name:"Fernanda",rating:5,date:"4 meses",comment:"Amo a linha Love. É clássica, não é chamativa demais, mas quem sabe o que é fica só secando de longe."},
    {name:"Rafael",rating:5,date:"5 meses",comment:"Sua namorada vai postar uns 25 stories da caixa, sacola, fita... É o pacote completo da experiência da ostentação."}
  ]},
  { id:21, name:"Brincos Bulgari Serpenti Viper Rosé", tag:"Alta Joalheria", category:"joias", oldPrice:32999, price: 2799900, rating:5.0, salesCount:150, description:"Ouro rosé 18K com pavê de diamantes.", image:"/images/1535632066927-ab7c9ab60908.webp", specs:["Ouro Rosé","Diamantes","Serpenti","Certificado"], reviews:[
    {name:"Luísa M.",rating:5,date:"Ontem",comment:"Os diamantes brilham tanto que me confundiram com celebridade no shopping. Adorei. Dei autógrafo."},
    {name:"Carlos H.",rating:5,date:"1 semana",comment:"Dei pra minha noiva e ela achou que eu tava envolvido com agiotas por causa do preço. Tive que jurar que foi no DopaShop."},
    {name:"Marina",rating:5,date:"2 semanas",comment:"A cobra em ouro rosé abraçando a orelha é a coisa mais chique, sexy e levemente ameaçadora. Me sinto uma vilã de novela e eu amo isso."},
    {name:"Sofia",rating:4,date:"3 semanas",comment:"Lindo mas a tarracha é tão forte que eu achei que ia precisar chamar o Corpo de Bombeiros pra tirar da orelha antes de dormir."},
    {name:"Beatriz",rating:5,date:"1 mês",comment:"Pesa a orelha? Não. Pesa a consciência? Também não. O pavê de diamantes é absolutamente hipnótico de olhar de perto."},
    {name:"Dona Carmen",rating:1,date:"1 mês",comment:"Cobra atrai falsidade e energia ruim. Joguei sal grosso neles. Estragou um pouco o brilho do ouro, deviam ter feito um modelo de pomba da paz."},
    {name:"Alice",rating:5,date:"2 meses",comment:"Toda vez que uso, o garçom me atende primeiro no restaurante e o meu drink sai de graça. Coisas inexplicáveis do poder aquisitivo visual."},
    {name:"Gabi",rating:5,date:"3 meses",comment:"Combina com TUDO. Sério, do pijama até o vestido de gala (testei os dois com ele e ficou impecável)."},
    {name:"Laura",rating:4,date:"4 meses",comment:"Achei um pouco intimidador as pessoas olhando pra minha orelha direto na rua. Você não compra a joia, a joia é que domina o ambiente."},
    {name:"Ricardo",rating:5,date:"5 meses",comment:"Minha esposa me ameaça com eles. Ela diz 'olha a cobra' e eu já sei que preciso concordar com tudo o que ela tá falando. Muito eficaz."}
  ]},
  { id:22, name:"Barco de Sushi Premium 150 Peças", tag:"Fome de Dragão", category:"alimentos", oldPrice:450, price: 29900, rating:4.9, salesCount:845, description:"Salmão, Atum, Polvo e Iguarias Japonesas.", image:"/images/1579871494447-9811cf80d66c.webp", specs:["150 Peças","Fresco","Pauzinhos Inclusos","Barco de Madeira"], reviews:[
    {name:"JapaBoy",rating:5,date:"Ontem",comment:"Comi tanto que acordei falando japonês. Arigatou DopaShop!"},
    {name:"Ana P.",rating:4,date:"2 dias",comment:"O barco é tão grande que dá pra usar de canoa depois de comer."},
    {name:"FomeZero",rating:5,date:"1 semana",comment:"Achei que era exagero, mas comi tudo sozinho assistindo anime. Zero arrependimentos, muita azia."},
    {name:"Sushiman",rating:1,date:"1 mês",comment:"Faltou shoyu! Como que manda 150 peças e só dois sachês de shoyu? Um ultraje à culinária."},
    {name:"Livia",rating:5,date:"2 meses",comment:"Peixe super fresco, parecia que tava nadando no molho tarê."},
    {name:"Otaku_Ninja",rating:5,date:"2 meses",comment:"Naruto ficaria com inveja. O melhor sushi imaginário que já consumi."},
    {name:"Carlos",rating:5,date:"3 meses",comment:"Custo benefício absurdo por 0,00 Dopas."},
    {name:"Marina",rating:4,date:"3 meses",comment:"Deixei na geladeira e minha família comeu tudo de madrugada. Só sobrou o barco de enfeite."},
    {name:"Rafael",rating:5,date:"4 meses",comment:"O wasabi é tão forte que limpou meus seios da face até 2030."},
    {name:"Lucas",rating:5,date:"5 meses",comment:"Sushi de qualidade. O atum derrete mais que meus sonhos de infância."}
  ]},
  { id:23, name:"Torre de Hambúrguer 10 Carnes", tag:"Desafio Cardíaco", category:"alimentos", oldPrice:120, price: 8900, rating:4.8, salesCount:1230, description:"10 blends de costela, bacon infinito e cheddar jorrando.", image:"/images/1568901346375-23c9450c58cd.webp", specs:["10 Carnes","Bacon Artesanal","Piscina de Cheddar","Pão Brioche"], reviews:[
    {name:"Ogromon",rating:5,date:"Ontem",comment:"Tive que deslocar minha mandíbula como uma cobra pra conseguir dar a primeira mordida."},
    {name:"Cardiologista",rating:1,date:"4 dias",comment:"Isso é um atentado à saúde pública. Vou comprar mais dois."},
    {name:"Gordo Saudável",rating:5,date:"1 semana",comment:"Vem com uma folhinha de alface então é dieta."},
    {name:"Mikael",rating:4,date:"2 semanas",comment:"O bacon é crocante, o cheddar é quente, mas a torre caiu no meu colo e sujou meu Air Jordan falso."},
    {name:"Thais",rating:5,date:"1 mês",comment:"Dividi com 6 pessoas e ainda sobrou. Incrível."},
    {name:"Paulo",rating:5,date:"1 mês",comment:"Meia hora pra comer, 3 horas no banheiro. Uma experiência catártica."},
    {name:"João",rating:5,date:"2 meses",comment:"O pão brioche brilha mais que minha testa no verão."},
    {name:"Fernando",rating:3,date:"3 meses",comment:"Muito difícil de comer, precisei de talheres e me senti ofendido por isso."},
    {name:"Bia",rating:5,date:"4 meses",comment:"Dopamina pura em formato de colesterol."},
    {name:"Tiago",rating:5,date:"5 meses",comment:"Se eu morrer comendo isso, coloquem na minha lápide: 'Morreu feliz'."}
  ]},
  { id:24, name:"Vodka Premium de Batata Russa 2L", tag:"Esquenta", category:"alimentos", oldPrice:299, price: 15000, rating:4.7, salesCount:850, description:"Pura, forte e direto de Moscou (do simulador).", image:"/vodka_russa.webp", specs:["2 Litros","Triplamente Destilada","Batata","Teor 45%"], reviews:[
    {name:"Vladmir",rating:5,date:"1 dia",comment:"Bebi um copo e comecei a dançar Kasatchok no meio da rua."},
    {name:"Zé da Pinga",rating:5,date:"3 dias",comment:"Desce rasgando e sobe sorrindo. O fígado chora mas a alma canta."},
    {name:"Amanda",rating:2,date:"1 semana",comment:"Comprei pra fazer caipirinha, esqueci meu próprio nome no segundo copo."},
    {name:"Estudante Fudido",rating:5,date:"2 semanas",comment:"Rendeu a festa inteira da faculdade e ainda sobrou pra limpar o chão no dia seguinte."},
    {name:"Lucas",rating:5,date:"1 mês",comment:"Usei no motor do meu Monza e ele andou 50km."},
    {name:"Bruno",rating:4,date:"2 meses",comment:"A garrafa é enorme, não coube no frigobar. Tive que beber metade pra esvaziar espaço."},
    {name:"Fernanda",rating:5,date:"3 meses",comment:"Meus problemas sumiram. O dinheiro também sumiria se não fosse de graça."},
    {name:"Matheus",rating:5,date:"4 meses",comment:"Forte demais. O gelo derrete com medo quando cai no copo."},
    {name:"Sérgio",rating:3,date:"4 meses",comment:"Fiquei cego por 5 minutos, mas depois passou. Recomendo."},
    {name:"Ricardo",rating:5,date:"5 meses",comment:"Sabor puro da mãe Rússia destilada em zeros e uns no DopaShop."}
  ]},
  { id:25, name:"Pizza de Calabresa 3 Metros", tag:"Tamanho Família", category:"alimentos", oldPrice:180, price: 12000, rating:4.9, salesCount:2100, description:"A maior pizza da cidade, chega dobrada.", image:"/images/1513104890138-7c749659a591.webp", specs:["3 Metros","Borda Recheada","Cebola Extra","Forno a Lenha"], reviews:[
    {name:"Tartaruga Ninja",rating:5,date:"2 dias",comment:"Cowabunga! Comemos no esgoto e sobrou pro café da manhã."},
    {name:"Entregador",rating:1,date:"1 semana",comment:"Tive que trazer isso num caminhão baú porque não cabia na bag da moto. Sacanagem."},
    {name:"Fabio",rating:5,date:"2 semanas",comment:"A borda de catupiry é tão grossa que serve de travesseiro."},
    {name:"Marcela",rating:5,date:"1 mês",comment:"O queijo esticou do quarto até a sala. Maravilhoso."},
    {name:"Tia do Zap",rating:4,date:"1 mês",comment:"Faltou azeitona no metro 2, mas o metro 1 tava ótimo."},
    {name:"Junior",rating:5,date:"2 meses",comment:"Comi tanto que minha barriga parece a caixa da pizza. Redonda e enorme."},
    {name:"Pedro",rating:5,date:"3 meses",comment:"Ideal pra quando você tá 'com um pouquinho' de fome."},
    {name:"Cleber",rating:5,date:"3 meses",comment:"Calabresa de qualidade, suou óleo na caixa igual churrasco de domingo."},
    {name:"Ana",rating:3,date:"4 meses",comment:"Não coube na porta. Tivemos que comer no corredor do prédio com os vizinhos olhando."},
    {name:"Beto",rating:5,date:"5 meses",comment:"Obra de arte da culinária italiana versão pedreiro faminto."}
  ]},
  { id:26, name:"Placa de Pare (Usada)", tag:"Ilegal & Decorativo", category:"ilicitos", oldPrice:350, price: 5000, rating:4.9, salesCount:142, description:"Retirada na calada da noite. Traz charme urbano ao seu quarto.", image:"/placa_pare_cartoon.webp", specs:["Metal Enferrujado","Sem Parafusos","Refletiva","Adrenalina"], reviews:[
    {name:"Cleitinho",rating:5,date:"Ontem",comment:"Decoração 10/10. Minha mãe perguntou por que a esquina de baixo tava sem placa, fingi demência."},
    {name:"Agente de Trânsito",rating:1,date:"3 dias",comment:"Devolve a placa do cruzamento da Rua 15, estão acontecendo batidas diárias lá seu marginal!"},
    {name:"Design de Interiores",rating:5,date:"1 semana",comment:"O estilo industrial underground ficou perfeito com os furos de bala no alumínio."},
    {name:"Pedro",rating:4,date:"2 semanas",comment:"Veio suja de barro e cocô de pombo, mas o que vale é a autenticidade do produto."},
    {name:"Luiza",rating:5,date:"1 mês",comment:"Coloquei na porta do meu quarto pra ver se meus irmãos param de entrar sem bater. Funcionou."},
    {name:"Rato de Rua",rating:5,date:"2 meses",comment:"Brilha no escuro quando bato a lanterna. Luxo sustentável urbano."},
    {name:"Marcos",rating:3,date:"3 meses",comment:"Tentei vender no ferro velho e o cara ameaçou chamar a polícia. Tristeza."},
    {name:"Bia",rating:5,date:"3 meses",comment:"Amo o conceito de e-commerce de furto. Muito inovador."},
    {name:"Diego",rating:5,date:"4 meses",comment:"Pedi pelo app, entregaram de capuz às 3 da manhã na minha janela. Entrega premium furtiva."},
    {name:"Camila",rating:5,date:"5 meses",comment:"Sempre quis ter uma. O vermelho combina com minha cortina."}
  ]},
  { id:27, name:"CNH Falsificada do Batman", tag:"Identidade Secreta", category:"ilicitos", oldPrice:1500, price: 49900, rating:4.8, salesCount:310, description:"Documento perfeito para dirigir o Batmóvel nas madrugadas.", image:"/cnh_batman_cartoon.webp", specs:["Papel Moeda Falso","Foto com Máscara","Válida em Gotham","Categoria AB"], reviews:[
    {name:"Bruce W.",rating:5,date:"2 dias",comment:"Muito útil quando o Comissário Gordon faz blitz na ponte."},
    {name:"Coringa",rating:1,date:"1 semana",comment:"Comprei pra tentar me passar por ele no banco, o caixa riu da minha cara. Qualidade ruim, o selo soltou."},
    {name:"Robin",rating:4,date:"2 semanas",comment:"Só não dou 5 estrelas porque não vendem a minha CNH, e eu que dirijo a maioria das vezes."},
    {name:"PM de Gotham",rating:5,date:"1 mês",comment:"Parece real. Se ele passar na blitz eu libero fácil."},
    {name:"Mateus",rating:5,date:"1 mês",comment:"Mostrei pro bouncer da balada pra provar que sou maior de idade. Ele ficou confuso e me deixou entrar."},
    {name:"Felipe",rating:5,date:"2 meses",comment:"Impressão em altíssima qualidade. O holograma de morcego é um detalhe de gênio do falsificador."},
    {name:"Ana",rating:3,date:"3 meses",comment:"Meu namorado colocou isso na carteira e foi tentar abrir conta no banco. Passamos vergonha. Não recomendo o uso prático."},
    {name:"Bruno",rating:5,date:"4 meses",comment:"Excelente item de colecionador. Escondo no fundo da gaveta por segurança."},
    {name:"Carlos",rating:5,date:"5 meses",comment:"Vem até com os pontos na carteira por excesso de velocidade no Batmóvel. Atenção aos detalhes incrível."},
    {name:"Thiago",rating:5,date:"6 meses",comment:"Melhor investimento de 0,00 Dopas da minha vida. Sou o vingador da noite."}
  ]},
  { id:28, name:"Lote na Lua (Sem Escritura)", tag:"Invasão Espacial", category:"ilicitos", oldPrice:50000, price: 1500000, rating:4.7, salesCount:89, description:"Grileiros espaciais vendem terreno na cratera Tycho.", image:"/lote_lua_cartoon.webp", specs:["200 Hectares","Vista para a Terra","Gravidade Baixa","Sem IPTU"], reviews:[
    {name:"Elon M.",rating:5,date:"1 semana",comment:"Comprei pra construir um estacionamento pras minhas naves. Preço excelente."},
    {name:"NASA",rating:1,date:"2 semanas",comment:"Vocês não podem vender isso. A lua é patrimônio da humanidade. Estamos mandando advogados espaciais."},
    {name:"Zé da Grilagem",rating:5,date:"1 mês",comment:"Mandei cercar com arame farpado estelar. Quem pisar lá eu meto a foice laser."},
    {name:"Marcos",rating:4,date:"1 mês",comment:"Ótimo terreno, bem plano. Pena que é meio longe do centro comercial e não passa Uber."},
    {name:"Livia",rating:5,date:"2 meses",comment:"Sem vizinhos fofoqueiros, sem barulho de moto cortando giro, sem IPTU. O paraíso é aqui."},
    {name:"Bruno",rating:3,date:"3 meses",comment:"Comprei mas a viagem não tá inclusa. Como que eu chego pra capinar o lote? Deveria ter frete grátis."},
    {name:"Fernanda",rating:5,date:"3 meses",comment:"O documento falso em PDF veio assinado por um Alienígena. Achei muito profissional e credível."},
    {name:"Paulo",rating:5,date:"4 meses",comment:"Falta oxigênio, mas a vista compensa a asfixia."},
    {name:"Renato",rating:5,date:"5 meses",comment:"Invasão lunar é o futuro do ramo imobiliário. Invistam enquanto tá barato!"},
    {name:"Cíntia",rating:4,date:"5 meses",comment:"Muito bom, mas na foto parecia que tinha mais luz solar. Minha cratera é meio escura."}
  ]},
  { id:29, name:"Processador AMD Ryzen 7 7800X3D", tag:"Kabum Ninja", category:"gamer", oldPrice:3299, price: 259900, rating:4.9, salesCount:8450, description:"O rei dos jogos. 3D V-Cache para fps no talo.", image:"/images/1555617981-dac3880eac6e.webp", specs:["8 Núcleos","5.0GHz","AM5","104MB Cache"], reviews:[
    {name:"Filipe_FPS",rating:5,date:"Ontem",comment:"Meu CS:GO rodou a tantos quadros que vi o futuro. Obrigado AMD."},
    {name:"Marcos.Tech",rating:5,date:"2 dias",comment:"Frio e calculista. Esquenta menos que o meu celular."},
    {name:"João da LAN",rating:5,date:"1 semana",comment:"Instalei no PC da LAN house e os moleques não querem mais ir embora."},
    {name:"Carol Gamer",rating:4,date:"2 semanas",comment:"Não vem cooler na caixa. Tive que assoprar com a boca pra resfriar. Mas o desempenho é top."},
    {name:"ThiagoR",rating:5,date:"1 mês",comment:"Deixei cair no chão e quebrou o azulejo. Produto resistente."}
  ]},
  { id:30, name:"SSD 1TB Kingston NV2 M.2 NVMe", tag:"Custo Benefício", category:"gamer", oldPrice:499, price: 34900, rating:4.8, salesCount:15200, description:"Velocidade absurda para boot e loadings instantâneos.", image:"/ssd_nvme_m2.webp", specs:["1TB","PCIe 4.0","3500MB/s","M.2"], reviews:[
    {name:"PC da Xuxa",rating:5,date:"3 dias",comment:"Meu PC que demorava 5 minutos pra ligar agora liga antes de eu apertar o botão."},
    {name:"Alan_BR",rating:5,date:"1 semana",comment:"Comprei pra instalar Warzone. Coube o Warzone e sobrou espaço pra 2 fotos. Muito bom."},
    {name:"Velho Tech",rating:5,date:"2 semanas",comment:"Pensei que era um chiclete de tão pequeno. Impressionante a tecnologia."},
    {name:"Tadeu",rating:4,date:"1 mês",comment:"Faltou o parafusinho na placa mãe e tive que prender com fita dupla face. Funciona."},
    {name:"Mariana",rating:5,date:"2 meses",comment:"Velocidade da luz. Literalmente pisquei e o Windows instalou."}
  ]},
  { id:31, name:"Smartphone Samsung Galaxy S24 Ultra Titanium", tag:"Super Oferta", category:"masculino", oldPrice:9999, price: 749900, rating:4.9, salesCount:4300, description:"Galaxy AI, câmera de 200MP e zoom espacial.", image:"/images/1610945415295-d9bbf067e59c.webp", specs:["Titanium","256GB","AI","S-Pen"], reviews:[
    {name:"Fotógrafo",rating:5,date:"1 semana",comment:"Dei zoom na lua e consegui ver o lote que o pessoal invadiu lá. Câmera absurda."},
    {name:"Ricaço",rating:5,date:"2 semanas",comment:"O acabamento em titânio bloqueou um tiro (brincadeira, não testem)."},
    {name:"Lucas",rating:1,date:"1 mês",comment:"O AI traduziu minha conversa com o gringo errado e ele quis me bater. A IA tem que melhorar o inglês dela."},
    {name:"Carlos",rating:5,date:"2 meses",comment:"Pesado, parece um tijolo tecnológico. Amo tijolos tecnológicos."},
    {name:"Sabrina",rating:4,date:"3 meses",comment:"A S-Pen é ótima pra limpar o ouvido. (Não sigam meu exemplo)."}
  ]},
  { id:32, name:"Fritadeira Air Fryer Mondial 4L", tag:"Mercado Líder", category:"lazer", oldPrice:450, price: 29900, rating:4.7, salesCount:89000, description:"Frita sem óleo, salva casamentos, faz bolo.", image:"/air_fryer_mondial.webp", specs:["4 Litros","1500W","Antiaderente","Timer"], reviews:[
    {name:"Mãe de Família",rating:5,date:"Ontem",comment:"Fiz pão de queijo, bife, pudim, e separei o lixo reciclável com ela. Máquina milagrosa."},
    {name:"Solteiro Raiz",rating:5,date:"4 dias",comment:"Esquento pizza dormida e fica melhor que no dia anterior. Salvação."},
    {name:"Cheff Amador",rating:1,date:"1 semana",comment:"Fui fazer ovo cozido sem água e explodiu. O manual devia ter 100 páginas a mais de avisos para idiotas como eu."},
    {name:"Dona Neide",rating:5,date:"1 mês",comment:"Meu gás dura 1 ano agora. Só uso a Air Fryer pra tudo. Até agua pro café eu fervo nela."},
    {name:"Tia",rating:4,date:"2 meses",comment:"Muito boa, mas gasta energia. O painel apaga o bairro todo quando eu ligo."}
  ]},
  { id:33, name:"Smart TV 65\" LG OLED evo C3", tag:"Full HD+", category:"gamer", oldPrice:8999, price: 599900, rating:4.9, salesCount:2100, description:"Preto puro. Cores infinitas. A melhor TV do mundo.", image:"/images/1593359677879-a4bb92f829d1.webp", specs:["65 Polegadas","OLED 120Hz","WebOS","Dolby Vision"], reviews:[
    {name:"Cinefilo",rating:5,date:"2 dias",comment:"O preto é tão escuro que achei que a TV tava desligada. Tive que checar a tomada umas dez vezes."},
    {name:"Gamer_BR",rating:5,date:"1 semana",comment:"Liguei o PS5 Pro nisso aqui e chorei por 3 horas seguidas com a qualidade da imagem."},
    {name:"Jorge",rating:4,date:"2 semanas",comment:"Fina como papel. Deu um vento na sala e a TV quase voou. Fixem bem na parede."},
    {name:"Mariana",rating:5,date:"1 mês",comment:"Transformou minha sala de 2m quadrados num cinema IMAX particular. Fico tonta mas adoro."},
    {name:"Beto",rating:5,date:"2 meses",comment:"A melhor imagem que meus olhos de quem usa óculos 4 graus já viram."}
  ]},
  { id:34, name:"Cadeira Gamer ThunderX3", tag:"Ergonomia", category:"gamer", oldPrice:1499, price: 99900, rating:4.6, salesCount:5400, description:"Conforto extremo para virar a noite.", image:"/cadeira_gamer.webp", specs:["Até 150kg","Ajuste 180º","Couro Sintético","Almofadas"], reviews:[
    {name:"Coluna_Torta",rating:5,date:"1 semana",comment:"Minha coluna que parecia um 'S' agora parece um 'I'. Obrigado DopaShop."},
    {name:"SleepyHead",rating:5,date:"2 semanas",comment:"Deitei ela em 180 graus e dormi no meio da partida. Acordei com meu time me xingando."},
    {name:"Gordo_Gamer",rating:5,date:"1 mês",comment:"Aguentou meus 140kg tranquilamente. Ela range quando eu respiro, mas tá inteira."},
    {name:"Carlos",rating:3,date:"2 meses",comment:"O couro PU faz suar num nível absurdo no verão. Tem que jogar de toalha."},
    {name:"Ana Clara",rating:5,date:"3 meses",comment:"Montei sozinha em 20 minutos. Mais fácil que montar LEGO."}
  ]},
  { id:35, name:"Kit 4 Pneus Aro 14", tag:"Clássico Mercado Livre", category:"lazer", oldPrice:1200, price: 80000, rating:4.5, salesCount:12300, description:"Pneus para rodar no seu uninho com segurança.", image:"/pneus.webp", specs:["Aro 14","175/70","Econômico","4 Unidades"], reviews:[
    {name:"Uber123",rating:5,date:"3 dias",comment:"Coloquei no meu Onix e parei de derrapar na chuva. Cliente não vomita mais."},
    {name:"Zezé_Mecânico",rating:4,date:"1 semana",comment:"Borracha boa, faz um barulhinho na pista mas por esse preço tá parecendo de Fórmula 1."},
    {name:"Luiz P.",rating:1,date:"2 semanas",comment:"Tentei instalar na minha moto Biz e não deu certo. Vendedor não avisou que era de carro."},
    {name:"MotoristaX",rating:5,date:"1 mês",comment:"Chegou rápido, cheiroso (cheiro de pneu novo é viciante). O Corsa ficou brabo."},
    {name:"Seu Armando",rating:5,date:"2 meses",comment:"Mais durável que meu casamento."}
  ]},
  { id:36, name:"Xbox Series X 1TB", tag:"Potência Microsoft", category:"gamer", oldPrice:4999, price: 399900, rating:4.8, salesCount:6700, description:"A Xbox mais poderosa de todas. 4K a 120fps.", image:"/images/1621259182978-fbf93132d53d.webp", specs:["1TB SSD","4K 120fps","Ray Tracing","Game Pass"], reviews:[
    {name:"Master Chief",rating:5,date:"Ontem",comment:"Finalmente posso jogar Halo Infinite na TV gigante sem travar. O Game Pass vale cada centavo fictício."},
    {name:"Felipe",rating:5,date:"3 dias",comment:"Quick Resume é a melhor invenção desde o fogo. Troco de jogo mais rápido que troco de canal."},
    {name:"Rodrigo",rating:4,date:"1 semana",comment:"É um tijolo preto bonito. Uso de apoio de porta também. Multifuncional."},
    {name:"Carlos",rating:1,date:"2 semanas",comment:"Comprei pra jogar exclusivos e descobri que todos saem no PC também. Obrigado Phil Spencer."},
    {name:"Dona Cida",rating:5,date:"1 mês",comment:"Meu neto pediu esse aquário preto de natal. Não tem peixe dentro mas ele ficou feliz."}
  ]},
  { id:37, name:"Xbox Series S 512GB Carbon Black", tag:"Compacto", category:"gamer", oldPrice:2499, price: 189900, rating:4.6, salesCount:9200, description:"Next-gen acessível. Perfeito pra quem não tem TV 4K.", image:"/xbox_series_s_black.webp", specs:["512GB","1440p 120fps","Digital","Game Pass"], reviews:[
    {name:"Pobre Premium",rating:5,date:"2 dias",comment:"Quem disse que pobre não joga next-gen? 0,00 Dopas no DopaShop, nem precisa ser pobre."},
    {name:"Maria",rating:5,date:"1 semana",comment:"Tão pequeno que escondo da minha mãe atrás dos livros na estante. Ela acha que estou estudando."},
    {name:"Thiago",rating:4,date:"2 semanas",comment:"512GB acabou no primeiro dia. Warzone sozinho come metade. Comprei HD externo imaginário."},
    {name:"Lucas",rating:5,date:"1 mês",comment:"Perfeito pro quarto. Silencioso, bonito e roda tudo que eu preciso."},
    {name:"Dona Teresa",rating:1,date:"2 meses",comment:"Não tem leitor de disco?? Como vou assistir meus DVDs do Roberto Carlos??"}
  ]},
  { id:38, name:"PlayStation 4 Slim 1TB + 3 Jogos", tag:"Clássico Eterno", category:"gamer", oldPrice:2999, price: 149900, rating:4.7, salesCount:45000, description:"O console que marcou uma geração. Ainda forte.", image:"/images/1486401899868-0e435ed85128.webp", specs:["1TB","Full HD","3 Jogos","DualShock 4"], reviews:[
    {name:"Nostálgico",rating:5,date:"3 dias",comment:"God of War, Spider-Man e The Last of Us. Não preciso de mais nada na vida."},
    {name:"Juliana",rating:5,date:"1 semana",comment:"Comprei pro meu filho de 8 anos, agora eu é que jogo mais que ele. Viciei em Horizon."},
    {name:"Marcos",rating:4,date:"2 semanas",comment:"Faz barulho de avião decolando quando roda jogos pesados, mas faz parte do charme."},
    {name:"Roberto",rating:5,date:"1 mês",comment:"PS4 em 2026 é tipo Fusca: velho, barulhento mas todo mundo ama."},
    {name:"Luana",rating:1,date:"2 meses",comment:"Comprei achando que era PS5 porque tava barato. Culpa minha por não ler a descrição. Console é bom."}
  ]},
  { id:39, name:"Relógio Rolex Daytona Ouro Rosé", tag:"Joalheria Suprema", category:"joias", oldPrice:199999, price: 15999900, rating:5.0, salesCount:45, description:"O cronógrafo mais desejado do mundo. Lista de espera de 10 anos.", image:"/images/1548171915-e79a380a2a4b.webp", specs:["Ouro Rosé 18K","Automático","Cronógrafo","Cerâmica"], reviews:[
    {name:"Bilionário",rating:5,date:"Ontem",comment:"Na vida real a lista de espera é de 10 anos. No DopaShop chegou em 10 segundos. Melhor e-commerce do universo."},
    {name:"Maurício",rating:5,date:"1 semana",comment:"Pesa tanto no pulso que desenvolvi tendinite de luxo. Valeu cada grama."},
    {name:"Fernanda",rating:4,date:"2 semanas",comment:"Meu marido usa até pra dormir, tomar banho e lavar louça. Virou extensão do corpo."},
    {name:"Ricardo",rating:5,date:"1 mês",comment:"O tique-taque desse relógio soa como dinheiro caindo na conta."},
    {name:"Pedro",rating:5,date:"2 meses",comment:"Emprestei pro casamento do amigo. Todos os convidados olharam mais pro meu pulso que pra noiva."}
  ]},
  { id:40, name:"Pulseira Pandora Moments Rosé + 5 Charms", tag:"Presente Certeiro", category:"joias", oldPrice:2999, price: 229900, rating:4.8, salesCount:8900, description:"A pulseira que conta sua história com charms únicos.", image:"/images/1611652022419-a9419f74343d.webp", specs:["Rosé 14K","5 Charms","Fecho Coração","Caixa Premium"], reviews:[
    {name:"Ana K.",rating:5,date:"2 dias",comment:"Cada charm representa um momento da minha vida. O da pizza calabresa é o mais especial."},
    {name:"Marcela",rating:5,date:"1 semana",comment:"Comprei e agora quero mais 50 charms. Isso é vício pior que jogo mobile."},
    {name:"Thiago",rating:4,date:"2 semanas",comment:"Dei pra minha mãe no dia das mães. Ela chorou tanto que ferruginou o rosé com as lágrimas. Brincadeira."},
    {name:"Luana",rating:5,date:"1 mês",comment:"O barulhinho dos charms batendo é ASMR de luxo. Chacoalho o braço o dia todo."},
    {name:"Carlos",rating:1,date:"2 meses",comment:"Comprei 1 charm separado e custou mais que a pulseira. A Pandora é o Nespresso das joias."}
  ]},
  { id:41, name:"Anel Van Cleef & Arpels Alhambra Ouro", tag:"Raridade", category:"joias", oldPrice:55999, price: 4499900, rating:5.0, salesCount:78, description:"O trevo da sorte em ouro 18K com madrepérola.", image:"/images/1603561596112-0a132b757442.webp", specs:["Ouro 18K","Madrepérola","Trevo","Certificado"], reviews:[
    {name:"Celebridade",rating:5,date:"3 dias",comment:"Estou usando agora na foto do meu Instagram. 2 milhões de likes. Obrigada DopaShop."},
    {name:"Joalheiro",rating:5,date:"1 semana",comment:"Acabamento impecável. Até eu que trabalho com joias fiquei boquiaberto com a qualidade."},
    {name:"Carol",rating:4,date:"2 semanas",comment:"O trevo de 4 folhas realmente dá sorte? Ganhei na loteria imaginária logo depois de colocar."},
    {name:"Marina",rating:5,date:"1 mês",comment:"Minhas amigas pararam de falar comigo de inveja. Valeu a pena."},
    {name:"Roberto",rating:5,date:"2 meses",comment:"Dei pra minha esposa e ela tratou como relíquia sagrada. Guarda num cofre e só usa aos domingos."}
  ]},
  { id:42, name:"Diploma de Harvard (PDF Editável)", tag:"Fraude Acadêmica", category:"ilicitos", oldPrice:800, price: 19900, rating:4.9, salesCount:520, description:"Impressione no LinkedIn. Ninguém confere mesmo.", image:"/harvard_diploma_cartoon.webp", specs:["PDF Editável","Selo Holográfico","Qualquer Curso","Fonte Original"], reviews:[
    {name:"Desempregado PhD",rating:5,date:"Ontem",comment:"Coloquei no LinkedIn e recebi 47 propostas de emprego em 2 horas. A fraude acadêmica nunca esteve tão acessível."},
    {name:"RH Confuso",rating:1,date:"3 dias",comment:"Sou do RH e contratei 3 pessoas com esse diploma. Agora entendo porque o estagiário não sabe usar Excel."},
    {name:"Zé Diplomas",rating:5,date:"1 semana",comment:"Tenho de Harvard, MIT e Oxford. Minha parede parece um museu de mentiras. Lindo."},
    {name:"Mãe Orgulhosa",rating:5,date:"1 mês",comment:"Imprimi e emoldurei pra minha mãe. Ela chorou de orgulho. Não vou contar nunca."},
    {name:"Advogado",rating:4,date:"2 meses",comment:"A fonte tá um pouco diferente da original. Mas quem vai comparar? Ninguém."}
  ]},
  { id:43, name:"Senha do Wi-Fi do Vizinho (Garantida)", tag:"Conectividade Grátis", category:"ilicitos", oldPrice:50, price: 990, rating:4.6, salesCount:9999, description:"Internet ilimitada sem pagar. Inclui tutorial de desculpas.", image:"/wifi_vizinho_cartoon.webp", specs:["WPA3 Crack","Tutorial PDF","Desculpas Prontas","Suporte 24h"], reviews:[
    {name:"Caloteiro",rating:5,date:"Ontem",comment:"Cancelei meu plano de internet e tô usando a do Seu José há 6 meses. Ele reclama que tá lento mas não desconfia."},
    {name:"Hacker Meia-Boca",rating:4,date:"3 dias",comment:"Funcionou perfeitamente. O problema é que o vizinho assiste Netflix em 4K e sobra nada pra mim."},
    {name:"Vizinha Fofoqueira",rating:1,date:"1 semana",comment:"Descobri que MINHA senha tava sendo vendida aqui. Troquei pra 'PAGASEUWIFI2026' e resolvi."},
    {name:"Estudante",rating:5,date:"1 mês",comment:"Internet grátis pra assistir aula online. Usando infraestrutura alheia pra construir meu futuro."},
    {name:"Seu José",rating:1,date:"2 meses",comment:"ENTÃO ERA POR ISSO QUE MINHA INTERNET TAVA LENTA! Vou processar esse site fictício!"}
  ]},
  { id:44, name:"Gato de Energia Solar (Kit Completo)", tag:"Sustentável & Ilegal", category:"ilicitos", oldPrice:3000, price: 99900, rating:4.8, salesCount:340, description:"Energia grátis pro resto da vida. Inclui manual de fuga da Enel.", image:"/gato_energia_cartoon.webp", specs:["Painel Solar","Bypass Medidor","Manual Enel","Garantia Nenhuma"], reviews:[
    {name:"Eletricista Pirata",rating:5,date:"2 dias",comment:"Instalei em 2 horas. Minha conta de luz foi de 800 Dopas pra D$ 0. A Enel que lute."},
    {name:"Engenheiro",rating:4,date:"1 semana",comment:"Tecnicamente brilhante. Moralmente questionável. Mas funciona que é uma beleza."},
    {name:"Dona Maria",rating:5,date:"2 semanas",comment:"Agora ligo ar condicionado, 3 TVs e a secadora de roupa tudo junto. Liberdade energética!"},
    {name:"Fiscal da Enel",rating:1,date:"1 mês",comment:"Estamos rastreando cada comprador desse site. Podem ir juntando dinheiro pra multa. Abraços."},
    {name:"Sustentável",rating:5,date:"2 meses",comment:"É solar então é ecológico. Crime verde é menos crime. Lógica perfeita."}
  ]},
  { id:45, name:"Vibrador Turbo 3000 Ultra Silencioso", tag:"Prazer Proibido", category:"ilicitos", oldPrice:499, price: 19900, rating:4.9, salesCount:14500, description:"7 velocidades, à prova d'água, mais silencioso que seu segredo.", image:"/vibrador_cartoon_1784734326604.webp", specs:["7 Velocidades","USB-C","Silicone Médico","À Prova D'água"], reviews:[
    {name:"Anônima",rating:5,date:"Ontem",comment:"Silencioso? Mentira. Minha vizinha bateu na parede e perguntou se eu tava com furadeira. Mas funciona MUITO bem."},
    {name:"Maria Discreta",rating:5,date:"3 dias",comment:"Comprei achando que era um massageador de pescoço. Descobri que não era. Mas tô satisfeita do mesmo jeito."},
    {name:"Marido Traído",rating:1,date:"1 semana",comment:"Minha esposa não precisa mais de mim. Fui substituído por um negócio com pilha. Triste."},
    {name:"Vendedora",rating:5,date:"1 mês",comment:"Vendo na feira e esse aqui é o mais vendido. As tias chegam sussurrando o pedido como se fosse contrabando."},
    {name:"Solteira Premium",rating:5,date:"2 meses",comment:"Melhor investimento da minha vida. Não reclama, não ronca, não pede pra assistir futebol. Perfeito."}
  ]},
  { id:46, name:"Pepino de Borracha Realístico 22cm", tag:"Best Seller Oculto", category:"ilicitos", oldPrice:350, price: 14900, rating:4.8, salesCount:22000, description:"Ultra realístico com ventosa. Ideal pra... decoração.", image:"/pepino_cartoon_1784733557511.webp", specs:["22cm","Silicone Premium","Ventosa","Realístico"], reviews:[
    {name:"Compradora Tímida",rating:5,date:"Ontem",comment:"Veio embalado como 'luminária de mesa'. O entregador não desconfiou de nada. Excelente discrição."},
    {name:"Decoradora",rating:5,date:"4 dias",comment:"Uso como peso de papel no escritório. Os colegas ficam olhando estranho mas ninguém fala nada."},
    {name:"Mãe Curiosa",rating:1,date:"1 semana",comment:"Achei no quarto da minha filha. Ela disse que era uma vela decorativa. Eu fingi que acreditei."},
    {name:"Tia do Zap",rating:5,date:"1 mês",comment:"Comprei 5 pra dar de lembrancinha no chá de lingerie. O grupo do WhatsApp nunca mais foi o mesmo."},
    {name:"João Confuso",rating:4,date:"2 meses",comment:"Comprei sem querer achando que era um pepino orgânico pra salada. Fui fazer salada e estranhei a textura."}
  ]},
  { id:47, name:"Erva Premium do Hobbit (Pote 50g)", tag:"Shire's Finest", category:"ilicitos", oldPrice:200, price: 7900, rating:4.9, salesCount:42000, description:"Direto do Condado. Gandalf aprova. 100% orgânica e imaginária.", image:"/erva_cartoon_1784733546922.webp", specs:["50g","Orgânica","Condado","Gandalf Approved"], reviews:[
    {name:"Gandalf",rating:5,date:"Ontem",comment:"Um mago nunca chega atrasado, nem cedo demais. Ele chega exatamente quando a erva tá no ponto."},
    {name:"Bilbo B.",rating:5,date:"3 dias",comment:"Fumo no meu cachimbo olhando o pôr do sol no Condado. A paz que eu sinto é indescritível."},
    {name:"Delegado",rating:1,date:"1 semana",comment:"Tentei prender o vendedor mas ele disse que é tempero pra chá. Mostrou até o registro no Ministério do Condado."},
    {name:"Frodo",rating:4,date:"1 mês",comment:"Levei pro Monte da Perdição mas queimou antes de chegar. Comprei mais um pote."},
    {name:"Sam",rating:5,date:"2 meses",comment:"Planto batatas de dia e uso a erva do Sr. Bilbo de noite. Vida de hobbit é boa demais."}
  ]},
  { id:48, name:"Pó Mágico do Willy Wonka (100g)", tag:"Fábrica Secreta", category:"ilicitos", oldPrice:500, price: 29900, rating:5.0, salesCount:8900, description:"Pó efervescente que faz você flutuar. Efeitos colaterais: felicidade extrema.", image:"/po_cartoon_1784733517035.webp", specs:["100g","Efervescente","Sabor Morango","Flutuar Incluso"], reviews:[
    {name:"Willy Wonka",rating:5,date:"Hoje",comment:"Receita original da minha fábrica. Quem cheirar vai pro teto igual o Vovô Joe. Garantido."},
    {name:"Charlie",rating:5,date:"2 dias",comment:"Usei um pouquinho e flutuei até bater no ventilador de teto. 10/10 experiência."},
    {name:"Oompa Loompa",rating:4,date:"1 semana",comment:"Eu que faço esse troço lá na fábrica e nunca me deixam experimentar. Injustiça trabalhista."},
    {name:"Augustus",rating:1,date:"1 mês",comment:"Comi tudo de uma vez e fiquei preso no tubo de chocolate. De novo. Não aprendo."},
    {name:"Veruca Salt",rating:5,date:"2 meses",comment:"PAPAI EU QUERO MAIS! AGORA! DEZ POTES! Produto excelente."}
  ]},
  { id:49, name:"Nerf Tática Militar Edição Proibida", tag:"Armamento Pesado", category:"ilicitos", oldPrice:899, price: 49900, rating:4.7, salesCount:3400, description:"Atira dardos a 200km/h. Proibida em 47 países e em todas as escolas.", image:"/arma_cartoon_1784733526303.webp", specs:["200km/h","50 Dardos","Mira Laser","Full Auto"], reviews:[
    {name:"Rambo Jr.",rating:5,date:"Ontem",comment:"Acertei meu irmão no olho a 15 metros. Ele chorou 2 horas mas tem que admitir que a mira é precisa."},
    {name:"Soldado de Sofá",rating:5,date:"4 dias",comment:"Montei uma trincheira no corredor e defendo meu quarto de qualquer invasor. A casa é um campo de batalha."},
    {name:"Mãe Furiosa",rating:1,date:"1 semana",comment:"MEU FILHO QUEBROU O VASO DA MINHA MÃE COM ISSO. O vaso era de porcelana chinesa imaginária. Quero indenização."},
    {name:"Airsoft Boy",rating:4,date:"1 mês",comment:"Dói mais que airsoft. O dardo deixa marca vermelha por 3 dias. Adorei."},
    {name:"Vizinho",rating:1,date:"2 meses",comment:"Estou escrevendo essa avaliação com um dardo cravado na testa. O moleque do 302 é terrorista."}
  ]},
  { id:50, name:"Rim Esquerdo Seminovo (Compatível)", tag:"Peça de Reposição", category:"ilicitos", oldPrice:150000, price: 4999900, rating:4.6, salesCount:12, description:"Pouco uso, dono anterior era atleta. Documentação quase real.", image:"/rim_cartoon_1784733536163.webp", specs:["Tipo O+","Seminovo","Compatível","Gelo Incluso"], reviews:[
    {name:"Cirurgião",rating:5,date:"1 semana",comment:"Excelente qualidade do órgão. Veio no isopor com gelo seco e tudo. Profissionalismo nota 10."},
    {name:"Paciente",rating:5,date:"2 semanas",comment:"Tô com 3 rins agora. Um de fábrica e dois do DopaShop. Posso beber o que quiser."},
    {name:"Fiscal Anvisa",rating:1,date:"1 mês",comment:"ISSO É COMPLETAMENTE ILEGAL. Vamos interditar esse site fictício AGORA. Cadê o alvará imaginário??"},
    {name:"Estudante Medicina",rating:4,date:"2 meses",comment:"Comprei pra estudar anatomia. Meus colegas ficaram impressionados com o realismo. Ninguém precisa saber a origem."},
    {name:"Vendedor Anterior",rating:5,date:"3 meses",comment:"Vendi o meu pra comprar uma RTX 5090. Prioridades. Ainda tenho o outro funcionando perfeitamente."}
  ]},
  { id:51, name:"Lote em Marte (Garantido pelo Elon)", tag:"Planeta Vermelho", category:"ilicitos", oldPrice:1000000, price: 25000000, rating:4.9, salesCount:34, description:"Construa sua casa de veraneio em Marte antes que supervalorize.", image:"/marte_lote_cartoon.webp", specs:["500 Hectares","Cratera Premium","Vizinhança VIP","Sem Oxigênio"], reviews:[
    {name:"Visionário",rating:5,date:"1 semana",comment:"Comprei 3 lotes. Quando a Terra acabar, já tenho pra onde ir. Dinheiro bem gasto."},
    {name:"Triste",rating:2,date:"1 mês",comment:"Comprei mas percebi que não tem Uber pra lá ainda. Vou ter que esperar o foguete do Elon."},
    {name:"Terraplanista",rating:1,date:"2 meses",comment:"Fui enganado! A NASA mente e Marte é projeção holográfica. Quero meu estorno."},
    {name:"Marcos",rating:5,date:"3 meses",comment:"Botei uma plaquinha com meu nome. Os ETs que lutem pra invadir minha propriedade."},
    {name:"Engenheiro Espacial",rating:4,date:"4 meses",comment:"Terreno um pouco rochoso. Difícil de plantar batata igual no filme Perdido em Marte."}
  ]},
  { id:52, name:"Bolsa Gucci Marmont em Couro", tag:"Desejo de Consumo", category:"feminino", oldPrice:12999, price: 1050000, rating:4.9, salesCount:310, description:"Bolsa luxuosa italiana em couro chevron com logo dourado GG.", image:"/images/1548036328-c9fa89d128fa.webp", specs:["Couro Chevron","Detalhes em Ouro","Feita na Itália","Acompanha Dustbag"], reviews:[
    {name:"Camila",rating:5,date:"3 dias",comment:"Perfeita! Cabe exatamente o essencial e chama atenção por onde passa."},
    {name:"Vanessa",rating:5,date:"1 semana",comment:"Realizei meu sonho de ter uma Gucci. O couro é maravilhoso."}
  ]},
  { id:53, name:"Sapatos Christian Louboutin So Kate", tag:"Poder Feminino", category:"feminino", oldPrice:5500, price: 420000, rating:4.8, salesCount:450, description:"O scarpin mais icônico do mundo com a clássica sola vermelha.", image:"/images/1543163521-1bf539c55dd2.webp", specs:["Salto 120mm","Couro Verniz","Sola Vermelha","Bico Fino"], reviews:[
    {name:"Beatriz",rating:4,date:"2 semanas",comment:"Dói o pé? Dói. Mas eu fico 10cm mais alta e dona do mundo."},
    {name:"Marcela",rating:5,date:"1 mês",comment:"Poderosíssimo. Combina com tudo."}
  ]},
  { id:54, name:"Kit Maquiagem Profissional MAC", tag:"Make Perfeita", category:"feminino", oldPrice:1200, price: 89900, rating:4.9, salesCount:1200, description:"Base, corretivo, paleta de sombras e batons clássicos.", image:"/images/1522337660859-02fbefca4702.webp", specs:["12 Itens","Alta Cobertura","Hipoalergênico","Longa Duração"], reviews:[
    {name:"Juliana",rating:5,date:"Hoje",comment:"Cobertura impecável, as sombras pigmentam muito bem."},
    {name:"Alice",rating:5,date:"5 dias",comment:"Amo MAC, o kit veio super completo e sai mais em conta."}
  ]},
  { id:55, name:"Tênis Yeezy Boost 350 V2", tag:"Streetwear", category:"masculino", oldPrice:2500, price: 189900, rating:4.8, salesCount:2100, description:"O clássico Hype. Conforto absurdo e estilo inconfundível.", image:"/images/1608231387042-66d1773070a5.webp", specs:["Primeknit","Boost Sole","Design Exclusivo","Respirável"], reviews:[
    {name:"Lucas",rating:5,date:"1 semana",comment:"Parece que estou pisando nas nuvens."},
    {name:"Felipe",rating:4,date:"2 semanas",comment:"Muito estiloso, mas suja rápido."}
  ]},
  { id:56, name:"Relógio Omega Speedmaster", tag:"O Relógio da Lua", category:"masculino", oldPrice:45000, price: 3890000, rating:5.0, salesCount:85, description:"O primeiro relógio a ir para a lua. Precisão e história no seu pulso.", image:"/images/1524592094714-0f0654e20314.webp", specs:["Cronógrafo","Mecânico Manual","Cristal de Safira","Resistente a 50m"], reviews:[
    {name:"Rodrigo",rating:5,date:"1 mês",comment:"Uma obra prima da engenharia. Vale cada centavo."},
    {name:"Carlos",rating:5,date:"3 meses",comment:"Herança de família, comprei para passar pro meu filho."}
  ]},
  { id:57, name:"Jaqueta de Couro Harley Davidson", tag:"Biker Style", category:"masculino", oldPrice:3500, price: 280000, rating:4.9, salesCount:340, description:"Couro legítimo, pesada, com proteções e muito estilo para a estrada.", image:"/images/1551028719-00167b16eac5.webp", specs:["Couro Bovino 100%","Proteções Removíveis","Zíper Reforçado","Edição Limitada"], reviews:[
    {name:"Vitor",rating:5,date:"2 meses",comment:"Pesada e impõe respeito. Excelente para os rolês de domingo."},
    {name:"Sérgio",rating:4,date:"4 meses",comment:"Esquenta bastante, mas a qualidade é insana."}
  ]},
  { id:58, name:"Cachaça Artesanal Envelhecida 50 Anos", tag:"Ouro Líquido", category:"alimentos", oldPrice:1500, price: 99900, rating:5.0, salesCount:150, description:"Descansada em barris de carvalho francês por meio século. Desce macio.", image:"https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&q=80&w=600", specs:["Barris de Carvalho","50 Anos","Sabor Amadeirado","Garrafa Numerada"], reviews:[
    {name:"Seu Zé",rating:5,date:"1 semana",comment:"Isso aqui não é bebida, é remédio pra alma."},
    {name:"Pinguço Premium",rating:5,date:"3 semanas",comment:"Tomo num cálice de cristal. Espetacular."}
  ]},
  { id:59, name:"Cachaça Premium Edição Ouro 1L", tag:"Tradicional", category:"alimentos", oldPrice:120, price: 8500, rating:4.7, salesCount:3200, description:"O clássico brasileiro, perfeita para caipirinhas goumets ou pura.", image:"/images/1514362545857-3bc16c4c7d1b.webp", specs:["1 Litro","Envelhecida em Bálsamo","Teor 40%","Sabor Suave"], reviews:[
    {name:"Bartender",rating:5,date:"Hoje",comment:"Faz a melhor caipirinha que já preparei."},
    {name:"Tio Paulo",rating:4,date:"1 mês",comment:"Bom custo benefício pra beber no final de semana."}
  ]},
  { id:60, name:"Combinado Sushi Omakase 60 Peças", tag:"Festa Japonesa", category:"alimentos", oldPrice:350, price: 28000, rating:4.9, salesCount:890, description:"Seleção do Chef: Toro, Vieira, Polvo, Salmão trufado e mais.", image:"/images/1579584425555-c3ce17fd4351.webp", specs:["60 Peças","Salmão, Atum, Toro","Peixe Fresco","Wasabi Original"], reviews:[
    {name:"Amanda",rating:5,date:"Ontem",comment:"Qualidade de restaurante com estrela Michelin, na minha casa."},
    {name:"Daniel",rating:5,date:"4 dias",comment:"Peixes fresquíssimos, derrete na boca."}
  ]},
  { id:61, name:"Temaki de Salmão Gigante (1KG)", tag:"Desafio Otaku", category:"alimentos", oldPrice:180, price: 12000, rating:4.8, salesCount:2100, description:"Um cone monstruoso de salmão, cream cheese e cebolinha.", image:"/images/1611143669185-af224c5e3252.webp", specs:["1KG","Salmão Fresco","Cream Cheese Philadelphia","Alga Crocante"], reviews:[
    {name:"Gulosa",rating:5,date:"1 semana",comment:"Demorei 2 horas pra comer tudo. Melhor investimento."},
    {name:"Renato",rating:4,date:"2 semanas",comment:"Muita comida, a alga ficou um pouco mole no final, mas tava uma delícia."}
  ]},
  { id:62, name:"Brincos de Diamante 2 Quilates", tag:"Brilho Infinito", category:"joias", oldPrice:85000, price: 6990000, rating:5.0, salesCount:42, description:"Dois quilates de pura perfeição VVS1 cravados em platina.", image:"/images/1535632066927-ab7c9ab60908.webp", specs:["2 Quilates","Pureza VVS1","Platina 950","Certificado GIA"], reviews:[
    {name:"Magnata",rating:5,date:"2 meses",comment:"Dei de presente de aniversário de casamento, ela chorou de emoção."},
    {name:"Sofia",rating:5,date:"4 meses",comment:"Eles brilham tanto que cega os inimigos."}
  ]},
  { id:63, name:"Pulseira Cartier Juste un Clou com Diamantes", tag:"Ousadia de Luxo", category:"joias", oldPrice:72000, price: 6150000, rating:4.9, salesCount:110, description:"O famoso prego da Cartier, mas cravado com 32 diamantes reluzentes.", image:"/images/1611591437281-460bfbe1220a.webp", specs:["Ouro Amarelo 18K","32 Diamantes","Design Icônico","Caixa e Certificado"], reviews:[
    {name:"Patrícia",rating:5,date:"1 mês",comment:"Moderna e clássica ao mesmo tempo. Não tiro do braço."},
    {name:"Helena",rating:5,date:"3 meses",comment:"Combina super bem com minha pulseira Love."}
  ]},
  { id:64, name:"Placa de Vídeo Nvidia RTX 4090 Founders Edition", tag:"Monster GPU", category:"gamer", oldPrice:15999, price: 1299900, rating:4.9, salesCount:850, description:"A poderosa arquitetura Ada Lovelace entregando performance bruta e insana.", image:"/images/1591488320449-011701bb6704.webp", specs:["24GB GDDR6X","Ada Lovelace","DLSS 3","Ray Tracing"], reviews:[
    {name:"GamerPro",rating:5,date:"2 semanas",comment:"Roda qualquer coisa em 4K no ultra a 120fps rindo."},
    {name:"Eduardo",rating:4,date:"1 mês",comment:"Tive que trocar o gabinete e a fonte de energia, ela é GIGANTE."}
  ]},
  { id:65, name:"Placa de Vídeo AMD Radeon RX 7900 XTX", tag:"Custo Benefício High-End", category:"gamer", oldPrice:8999, price: 749900, rating:4.8, salesCount:1200, description:"Performance matadora em rasterização por um preço competitivo.", image:"/images/1587202372775-e229f172b9d7.webp", specs:["24GB GDDR6","RDNA 3","FSR 3","DisplayPort 2.1"], reviews:[
    {name:"Tiago",rating:5,date:"1 semana",comment:"Bate de frente com a 4080 e é mais barata. Excelente placa!"},
    {name:"Mateus",rating:5,date:"3 semanas",comment:"Perfeita para meu monitor 4K. Muito fria e silenciosa."}
  ]}
,
  {name:"Massageador de Pescoço 8 Pontos Aquecimento Relaxamento",tag:"Relaxamento",category:"lazer",oldPrice:299,price: 14990,rating:4.8,salesCount:300,description:"Massagem e alívio de tensão para ombros e pescoço. Diga adeus ao estresse.",image:"/massageador_pescoco.webp",specs:["8 Pontos","Aquecimento","Bivolt"],reviews:[],id:66},
  {name:"Kit Linha Completa Explosão de Azeite de Oliva bn.Cachos",tag:"Beleza",category:"feminina",oldPrice:120,price: 8990,rating:4.9,salesCount:450,description:"Umectação com óleo de abacate e azeite de oliva para cachos definidos.",image:"https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=600",specs:["Para Cachos","Óleo de Abacate","Azeite de Oliva"],reviews:[],id:67},
  {name:"Pneu Aro 14 Firestone F-600 175/65 R14 82T - 2 Unidades",tag:"Automotivo",category:"veiculos",oldPrice:450,price: 35000,rating:4.7,salesCount:1200,description:"Pneus Firestone para segurança e durabilidade. O par perfeito pro seu carro.",image:"/pneus.webp",specs:["Aro 14","175/65 R14","2 Unidades"],reviews:[],id:68},
  {name:"Fogão 5 Bocas Atlas Atenas com Mesa de Vidro",tag:"Eletrodomésticos",category:"lazer",oldPrice:1500,price: 120000,rating:4.9,salesCount:200,description:"Mesa de vidro, a gás, bivolt. Deixe sua cozinha mais chique e moderna.",image:"/fogao_5_bocas.webp",specs:["5 Bocas","Mesa de Vidro","Bivolt"],reviews:[],id:69},
  {name:"Bolsa Feminina De Ombro e Transversal em PU Diagonal",tag:"Moda",category:"feminina",oldPrice:150,price: 7990,rating:4.6,salesCount:800,description:"Tendência na moda atual. Perfeita para qualquer ocasião.",image:"https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600",specs:["Couro PU","Transversal","Espaçosa"],reviews:[],id:70},
  {name:"Vestido Indiano Curto Tribal Elegance Rodadinho",tag:"Moda Verão",category:"feminina",oldPrice:99,price: 6500,rating:4.5,salesCount:650,description:"Vestido verão com estampa localizada, alcinha ajustável.",image:"https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&q=80&w=600",specs:["Verão","Alça Ajustável","Tribal"],reviews:[],id:71},
  {name:"Kit 10 Peças Roupas Infantil Menina Sortido Verão",tag:"Infantil",category:"feminina",oldPrice:180,price: 12000,rating:4.8,salesCount:1100,description:"5 Camisetas e 5 Shorts pra criançada brincar confortável no calor.",image:"https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600",specs:["10 Peças","Verão","Sortido"],reviews:[],id:72},
  {name:"Combo Kemei PRO KM-1689 Kit Profissional Barba e Cabelo",tag:"Beleza Masculina",category:"masculino",oldPrice:200,price: 11000,rating:4.7,salesCount:3000,description:"Máquina de corte e acabamento pra lançar o degradê perfeito.",image:"https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=600",specs:["Sem Fio","Corte e Acabamento","Profissional"],reviews:[],id:73},
  {name:"Depilador Elétrico Feminino Recarregável Navalha Dupla",tag:"Cuidados Pessoais",category:"feminina",oldPrice:89,price: 4500,rating:4.5,salesCount:900,description:"Removedor de pelos prático, indolor e fácil de carregar na bolsa.",image:"/depilador_feminino.webp",specs:["Recarregável","Navalha Dupla","Portátil"],reviews:[],id:74},
  {name:"Kit 5 Blusas Femininas T-Shirt Malha Canelada Premium",tag:"Moda Casual",category:"feminina",oldPrice:150,price: 9990,rating:4.8,salesCount:1500,description:"Malha quentinha, veste super bem. Básicas e essenciais.",image:"https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600",specs:["5 Peças","Malha Canelada","Premium"],reviews:[],id:75},
  {name:"Scarpin Feminino Duas Fivelas Bellamore Salto Baixo",tag:"Calçados",category:"feminina",oldPrice:199,price: 13000,rating:4.6,salesCount:420,description:"Confortável, chique e com salto de 5cm. Vai bem com tudo.",image:"https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",specs:["Salto 5cm","Duas Fivelas","Elegante"],reviews:[],id:76},
  {name:"Kit Óleos Africanos Reparador de Pontas bn.Cachos",tag:"Cabelos Perfeitos",category:"feminina",oldPrice:85,price: 5500,rating:4.9,salesCount:600,description:"Poderosa umectação para fechar pontas duplas e nutrir os fios.",image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600",specs:["Reparador de Pontas","Nutrição","Africano"],reviews:[],id:77},
  { id: 100, name: "Pelúcia de Gatinho Gigante Fofinho 1 Metro", tag: "Fofura Extrema", category: "feminino", oldPrice: 299, price: 18990, rating: 5.0, salesCount: 1540, description: "Abrace esse gatinho gigante depois de um longo dia de trabalho.", image: "/pelucia_gatinho.webp", specs: ["1 Metro", "Anti-alérgico", "Ultra Macio", "Alivia Estresse"], reviews: [] },
  { id: 101, name: "Conjunto de Pijama de Seda Rosa Chique", tag: "Conforto Luxuoso", category: "feminino", oldPrice: 350, price: 19990, rating: 4.8, salesCount: 2200, description: "Pijama estilo blogueira rica para dormir se sentindo em Dubai.", image: "/pijama_seda_rosa.webp", specs: ["100% Seda", "Rosa Bebê", "Blusa e Calça", "Lavagem Fácil"], reviews: [] },
  { id: 102, name: "Luminária de Mesa Nuvem Kawaii", tag: "Decoração", category: "feminino", oldPrice: 150, price: 8990, rating: 4.9, salesCount: 3100, description: "Luminária de led em formato de nuvem que muda de cor. Deixa qualquer quarto lindo.", image: "/luminaria_nuvem.webp", specs: ["RGB", "Carregamento USB", "Silicone Soft", "Decoração"], reviews: [] },
  { id: 103, name: "Kit Skin Care Coreano Completo 10 Passos", tag: "Beleza Mágica", category: "feminino", oldPrice: 450, price: 29990, rating: 5.0, salesCount: 5200, description: "A famosa rotina de 10 passos da Coreia. Pele de porcelana garantida (na imaginação).", image: "/skincare_coreano.webp", specs: ["10 Produtos", "Essência de Caracol", "Máscara de Algodão", "Coreano"], reviews: [] },
  { id: 104, name: "Tênis Chunky Platform Branco e Rosa", tag: "Moda Gringa", category: "feminino", oldPrice: 380, price: 24990, rating: 4.7, salesCount: 1800, description: "O tênis mais instagramável do ano. Aumenta sua altura e sua autoestima.", image: "/tenis_chunky_rosa.webp", specs: ["Salto 6cm", "Couro Sintético", "Leve", "Moda Street"], reviews: [] },
  { id: 105, name: "Vestido Romântico Floral Estilo Cottagecore", tag: "Princesa", category: "feminino", oldPrice: 220, price: 14990, rating: 4.9, salesCount: 1350, description: "Para você correr por um campo de flores lendo poesias. Puro charme.", image: "/vestido_cottagecore.webp", specs: ["Estampa Floral", "Mangas Bufantes", "Decote Coração", "Tecido Leve"], reviews: [] },
  { id: 106, name: "Caneca Mágica Gatinho Escondido", tag: "Presente Criativo", category: "feminino", oldPrice: 85, price: 5590, rating: 4.8, salesCount: 4200, description: "Um gatinho fofo aparece no fundo da caneca conforme você bebe seu café.", image: "/caneca_gatinho.webp", specs: ["Cerâmica", "350ml", "Surpresa Interna", "Segura Microondas"], reviews: [] },
  { id: 107, name: "Mochila de Urso de Pelúcia", tag: "Aesthetic", category: "feminino", oldPrice: 199, price: 12990, rating: 4.6, salesCount: 980, description: "Uma mochila que também é o seu melhor amigo de pelúcia.", image: "/mochila_urso.webp", specs: ["Alças Ajustáveis", "Zíper Traseiro", "Pelúcia Alta", "Cabe Celular"], reviews: [] },
  { id: 108, name: "iPhone 17 Pro Max 512GB Lacrado 5G Dual E-sim", tag: "Lançamento Apple", category: "gamer", oldPrice: 9477, price: 892700, rating: 4.9, salesCount: 2300, description: "O iPhone mais avançado já feito. Câmera profissional, chip A19 Pro e tela ProMotion 120Hz.", image: "/iphone_17_pro_max.webp", specs: ["512GB", "5G Dual E-sim", "A19 Pro", "Câmera 48MP"], reviews: [
    {name:"Ricardão",rating:5,date:"Ontem",comment:"Vendi meu carro pra comprar esse iPhone. Agora ando de ônibus mas faço videochamada em 4K Dolby Vision pro meu chefe. Prioridades."},
    {name:"Maria Tech",rating:5,date:"3 dias",comment:"A câmera é tão boa que tirei foto do vizinho roubando manga e deu pra ver até o suor da testa dele em 48MP. Prova criminal em alta definição."},
    {name:"Zé Ostentação",rating:5,date:"1 semana",comment:"Comprei a versão laranja pra combinar com meu Fanta Uva. Mentira, é pra todo mundo ver de longe que sou Apple."},
    {name:"Carol",rating:4,date:"2 semanas",comment:"Pesado demais. Deu tendinite no mindinho de tanto segurar. Apple devia vender fisioterapia junto."},
    {name:"Tiozão do Zap",rating:1,date:"1 mês",comment:"Paguei quase 9 mil (de mentira) e o carregador não vem na caixa. A Apple é a maior trollagem capitalista da história."},
    {name:"Lucas P.",rating:5,date:"1 mês",comment:"Dynamic Island é a melhor invenção desde o botão de desligar alarme. Produtividade zero, mas bonito demais."},
    {name:"Fernanda",rating:5,date:"2 meses",comment:"Face ID destravou quando eu tava com máscara de argila, óculos e chapéu. Esse celular me conhece melhor que minha mãe."},
    {name:"Bruno Fanboy",rating:5,date:"2 meses",comment:"Android users chorando enquanto eu edito vídeo 8K no busão lotado. Ecossistema é tudo."},
    {name:"Dona Cleusa",rating:3,date:"3 meses",comment:"Meu neto comprou pra mim. Só uso pra mandar 'bom dia' no grupo da família. 9 mil Dopas pra bom dia. Tá certo."},
    {name:"Hacker Raiz",rating:5,date:"3 meses",comment:"Tentei fazer jailbreak e o iPhone mandou um e-mail pro Tim Cook me delatando. Segurança nota 10."}
  ]},
  { id: 109, name: "Parafusadeira 2 Baterias 48v Furadeira Maleta 24pcs", tag: "Oferta Relâmpago", category: "lazer", oldPrice: 126.98, price: 10794, rating: 4.9, salesCount: 5710, description: "Kit completo com 2 baterias, maleta e 24 peças. Pronta entrega.", image: "/parafusadeira_48v.webp", specs: ["48V", "2 Baterias", "24 Peças", "Maleta Inclusa"], reviews: [
    {name:"Pedreiro Raiz",rating:5,date:"Ontem",comment:"Essa parafusadeira tem mais torque que meu Gol quadrado. Apertei um parafuso com tanta força que ele atravessou a parede e prendeu a TV do vizinho."},
    {name:"Marido de Aluguel",rating:5,date:"3 dias",comment:"Minha esposa pediu pra pendurar um quadro. 4 horas depois eu já tinha montado uma estante, trocado a fechadura e furado 7 buracos desnecessários. Viciante."},
    {name:"João da Obra",rating:5,date:"1 semana",comment:"As 2 baterias duram o dia inteiro. Quando uma acaba, troca pela outra e o serviço não para. Genial."},
    {name:"Dona Sandra",rating:1,date:"2 semanas",comment:"Meu marido comprou e agora TUDO em casa tá parafusado. A tampa do vaso sanitário, o controle da TV, até o gato ele tentou aparafusar na parede."},
    {name:"Carlos DIY",rating:4,date:"1 mês",comment:"A maleta vem com tudo que você precisa pra fingir que é engenheiro civil no churrasco de domingo."},
    {name:"Marcos",rating:5,date:"1 mês",comment:"Por esse preço eu comprei 3. Uma pra casa, uma pro trabalho e uma pra deixar no carro caso eu precise furar algo na estrada. Paranoico? Talvez. Preparado? Com certeza."},
    {name:"Tia Lurdes",rating:5,date:"2 meses",comment:"Montei meu guarda-roupa de MDF sozinha em 20 minutos. O manual dizia 3 horas. Sou mais eficiente que o IKEA."},
    {name:"Fernando",rating:5,date:"2 meses",comment:"O LED embutido é show. Agora furo parede de madrugada iluminando o alvo com precisão cirúrgica. O vizinho não aprecia."},
    {name:"Zé Gambá",rating:3,date:"3 meses",comment:"48V na descrição mas não parece 48V de verdade. Mesmo assim, parafusa tudo que eu quero. Nota 3 por princípio de marketing."},
    {name:"Engenheira",rating:5,date:"3 meses",comment:"Custo benefício absurdo. Por 107 Dopas no DopaShop eu ganho mais felicidade do que com um diploma de pós-graduação."}
  ]},
  { id: 110, name: "Saxofone Alto Profissional Eb Laqueado com Case", tag: "Instrumentista", category: "lazer", oldPrice: 1700, price: 151400, rating: 5.0, salesCount: 70, description: "Saxofone alto profissional em Mi bemol, laqueado dourado. Acompanha estojo rígido.", image: "/saxofone_alto.webp", specs: ["Alto Eb", "Laqueado Dourado", "Case Estojo", "Profissional"], reviews: [
    {name:"Kenny G Brasileiro",rating:5,date:"Ontem",comment:"Toquei na sacada do apartamento às 23h e o SAMU veio achando que era pedido de socorro. Mas os vizinhos aplaudiram (de raiva ou admiração, não sei)."},
    {name:"Musicista",rating:5,date:"4 dias",comment:"Timbre incrível, afinação precisa. Pelo preço que paguei (nada), é o melhor investimento musical da minha vida."},
    {name:"Tio do Bar",rating:5,date:"1 semana",comment:"Comprei pra tocar no bar do Zé. Agora a clientela dobrou e o Zé me paga em pastel. Win-win."},
    {name:"Vizinho Irritado",rating:1,date:"2 semanas",comment:"MEU VIZINHO COMPROU UM DESSES. SÃO 3 DA MANHÃ E ELE TÁ TOCANDO CARELESS WHISPER PELA 47ª VEZ. VOU PROCESSAR ESSE SITE."},
    {name:"Professor de Música",rating:5,date:"1 mês",comment:"Uso como instrumento principal nas aulas. Meus alunos ficam hipnotizados com o brilho do laqueado. Ensinar ficou mais fácil quando o sax é bonito."},
    {name:"Lúcia",rating:4,date:"1 mês",comment:"Comprei pro meu filho de 12 anos. Ele soprou tão forte que saiu uma nota que só os cachorros ouviram. Mas é lindo de enfeite."},
    {name:"Jazzista",rating:5,date:"2 meses",comment:"Tom quente, grave encorpado. Perfeito pra blues e jazz. Minha alma chorou de emoção na primeira nota."},
    {name:"Rodrigo",rating:5,date:"2 meses",comment:"Case rígido é essencial. Deixei cair da escada e o sax saiu ileso. Eu não, mas o importante é o instrumento."},
    {name:"Dona Carmem",rating:3,date:"3 meses",comment:"Achei que era decoração dourada pra sala. Meu genro começou a soprar e eu quase tive um infarto."},
    {name:"Sérgio Sax",rating:5,date:"3 meses",comment:"Lisa Simpson ficaria com inveja. O som desse sax ecoa pela rua inteira. Sou a lenda do bairro agora."}
  ]},
  { id: 111, name: "Motor Completo 4t Moby 4 Marchas 100cc", tag: "Peça Oficial", category: "lazer", oldPrice: 1784.92, price: 159213, rating: 4.9, salesCount: 580, description: "Motor completo 4 tempos com 4 marchas. Compatível com Moby, Mobilete e similares.", image: "/motor_100cc.webp", specs: ["100cc", "4 Tempos", "4 Marchas", "Completo"], reviews: [
    {name:"Zé da Grau",rating:5,date:"Ontem",comment:"Coloquei na minha mobilete e agora ela anda mais que o Civic do meu vizinho. O grau de ré ficou absurdo."},
    {name:"Mecânico de Fundo de Quintal",rating:5,date:"3 dias",comment:"Motor redondinho. Instalei em 2 horas com uma chave de boca e um pedaço de arame. Engenharia brasileira no talo."},
    {name:"Dona Maria",rating:1,date:"1 semana",comment:"Meu filho colocou isso na bicicleta dele e agora ele faz delivery mais rápido que o Uber Flash. Mas a PM não aprova."},
    {name:"Piloto de Mobilete",rating:5,date:"2 semanas",comment:"100cc de pura adrenalina. Passei por um Porsche no sinal. O cara olhou pra minha mobilete customizada e chorou de inveja. Ou de rir. Não importa."},
    {name:"Tio Valdir",rating:5,date:"1 mês",comment:"Veio completinho, até o carburador tá ajustado. Só montar e sair cortando giro no bairro. Os moleques respeitam."},
    {name:"Rodrigo Grau",rating:4,date:"1 mês",comment:"Motor é brabo mas a mobilete não aguenta a potência. Tive que reforçar o quadro com cano de água. Frankestein das duas rodas."},
    {name:"Carlos Moto",rating:5,date:"2 meses",comment:"Consumo excelente, faz 60km/l. O tanquinho de 2 litros dura a semana toda indo pro trabalho. Economia de rei."},
    {name:"PM do Bairro",rating:1,date:"2 meses",comment:"Eu sei quem comprou isso. Tô de olho no moleque da esquina que tá fazendo grau às 2 da manhã. O motor é bom mas o DETRAN não aprova."},
    {name:"Lucas Funilaria",rating:5,date:"3 meses",comment:"Montei numa carroça motorizada e agora faço frete pelo bairro. Empreendedorismo raiz com tecnologia 4 tempos."},
    {name:"Engenheiro Mecânico",rating:5,date:"3 meses",comment:"Surpreendentemente bem acabado pro preço. As engrenagens são lisas e o motor ronca bonito. 10/10 pra quem curte mexer com motor."}
  ]},
  { id: 112, name: "Console PlayStation 5 Pro 2TB Branco Bivolt", tag: "Mais Vendido", category: "gamer", oldPrice: 8009.97, price: 679900, rating: 4.9, salesCount: 5000, description: "O console mais poderoso da Sony. 2TB de armazenamento, Ray Tracing avançado e PSSR.", image: "/ps5_pro_2tb.webp", specs: ["2TB SSD", "Ray Tracing", "PSSR", "4K/120fps"], reviews: [
    {name:"Gamer Endinheirado",rating:5,date:"Ontem",comment:"Comprei no Mercado Livre por 6.799 Dopas de mentira. Na vida real teria que vender a geladeira. No DopaShop é grátis. Melhor timeline."},
    {name:"Rodrigo PS",rating:5,date:"2 dias",comment:"2TB de espaço! Finalmente consigo ter mais de 3 jogos instalados ao mesmo tempo. Sony finalmente ouviu nossos choros."},
    {name:"Mãe Preocupada",rating:2,date:"1 semana",comment:"Meu filho parou de comer, tomar banho e ir na escola desde que chegou. O console é bonito mas destruiu minha família."},
    {name:"Xbox Fanboy",rating:1,date:"2 semanas",comment:"Vim só pra dizer que o Game Pass é melhor. Pronto, falei. O console em si é bom, admito com dor no coração."},
    {name:"Thiago Gamer",rating:5,date:"1 mês",comment:"O SSD é tão rápido que o jogo carrega antes de eu sentar no sofá. Tenho que ficar de pé pra não perder a introdução."},
    {name:"Felipe R.",rating:5,date:"1 mês",comment:"O design é lindo, combina com minha sala. Minha esposa achou que era um umidificador de ar moderno e ficou feliz. Não corrigi."},
    {name:"Marcos Platina",rating:5,date:"2 meses",comment:"Já platinei 5 jogos em uma semana. O console é tão bom que me fez trocar meu hobby de academia por sofá. Meus bíceps diminuíram mas meus troféus aumentaram."},
    {name:"Carla",rating:4,date:"2 meses",comment:"Muito grande e branco. Suja de poeira fácil. Parece um mini frigobar estiloso na sala. Mas joga demais."},
    {name:"Juninho Online",rating:5,date:"3 meses",comment:"Liguei na minha TV 4K OLED e chorei por 20 minutos com os gráficos de Astro Bot. Não tenho vergonha de admitir."},
    {name:"Dona Cida",rating:3,date:"3 meses",comment:"Comprei pro neto. Ele me explicou que não é DVD player. Decepcionada mas ele tá feliz, e isso é o que importa."}
  ]},
  { id: 113, name: "Projetor de Galáxia Astronauta", tag: "Shopee Vibes", category: "lazer", oldPrice: 150, price: 4990, rating: 4.8, salesCount: 8400, description: "Um astronautinha que projeta o universo no teto do seu quarto. Para crises existenciais noturnas.", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=400", specs: ["Controle Remoto", "Nebulosas Coloridas", "Cabeça Magnética", "Timer"], reviews: [
    {name:"Insone",rating:5,date:"2 dias",comment:"Fico olhando pro teto refletindo sobre a imensidão do universo e o limite do meu cheque especial. Recomendo."}
  ]},
  { id: 114, name: "Mini Liquidificador Portátil USB", tag: "Fitness de Mentira", category: "feminino", oldPrice: 90, price: 3590, rating: 4.2, salesCount: 15200, description: "Bate uma vitamina (ou tenta). Excelente para enfeitar a mesa do escritório.", image: "/mini_liquidificador.webp", specs: ["Bateria USB", "Lâminas Fraquinhas", "380ml", "Design Fofo"], reviews: [
    {name:"Maromba",rating:2,date:"1 semana",comment:"Fui bater um whey com gelo e a hélice quebrou. Serve pra misturar água com açúcar no máximo."}
  ]},
  { id: 115, name: "Umidificador de Ar Gatinho LED", tag: "Fofura Respiratória", category: "feminino", oldPrice: 70, price: 2990, rating: 4.7, salesCount: 9300, description: "Solta uma fumacinha gostosa e brilha no escuro. Ajuda na rinite e na carência.", image: "/umidificador_gatinho.webp", specs: ["Luz RGB", "Capacidade 250ml", "Silencioso", "Cabo USB"], reviews: []},
  { id: 116, name: "Apoio de Pé para Vaso Sanitário (Cagar Suave)", tag: "Saúde Intestinal", category: "lazer", oldPrice: 50, price: 1990, rating: 5.0, salesCount: 22000, description: "A posição fisiológica perfeita. Sua vida no banheiro nunca mais será a mesma.", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=400", specs: ["Plástico Resistente", "Ergonômico", "Base Antiderrapante"], reviews: [
    {name:"Rei do Trono",rating:5,date:"1 mês",comment:"Mudou minha vida. Antes eu demorava 30 min, agora em 5 tô novo. O ângulo de 35 graus é magia negra gastronômica."}
  ]},
  { id: 117, name: "Dispenser Automático de Pasta de Dente", tag: "Preguiça Extrema", category: "lazer", oldPrice: 40, price: 1590, rating: 4.4, salesCount: 12000, description: "Aperte com a escova e a pasta sai. Às vezes cai na pia, mas faz parte da experiência.", image: "/dispenser_pasta_dente.webp", specs: ["Sem Furos", "Adesivo 3M", "Porta Escovas"], reviews: []},
  { id: 118, name: "Adesivo Emagrecedor Magnético para Umbigo", tag: "Milagre Asiático", category: "feminino", oldPrice: 30, price: 990, rating: 2.1, salesCount: 45000, description: "Cole no umbigo e perca 10kg dormindo. Fonte: Confia.", image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&q=80&w=400", specs: ["Ervas Naturais", "Ímã Central", "Efeito Placebo"], reviews: [
    {name:"Iludida",rating:1,date:"3 semanas",comment:"Colei 5 na barriga e comi uma pizza. Engordei 2kg. Propaganda enganosa!!"}
  ]},
  { id: 119, name: "Relógio Smartwatch D20 Pulseira Rosa", tag: "Apple Watch Falso", category: "feminino", oldPrice: 120, price: 2590, rating: 4.0, salesCount: 88000, description: "Mede seus passos (mesmo se você balançar o braço sentado). Não pode ver água.", image: "https://images.unsplash.com/photo-1544117519-31a4b719223d?auto=format&fit=crop&q=80&w=400", specs: ["Bluetooth", "Notifica Zap", "Bateria dura 2h", "Tela TFT"], reviews: [
    {name:"Blogueirinha",rating:5,date:"2 dias",comment:"Fica lindo na foto do espelho na academia. Ninguém sabe que paguei 25 conto."}
  ]},
  { id: 120, name: "Fita Adesiva Mágica Nano Dupla Face Lavável", tag: "Gambiarras", category: "lazer", oldPrice: 25, price: 1290, rating: 4.9, salesCount: 32000, description: "Cola tijolo, quadro, sogra na parede. Lave e use de novo.", image: "https://images.unsplash.com/photo-1589384267710-7a170981ca78?auto=format&fit=crop&q=80&w=400", specs: ["Transparente", "3 Metros", "Reutilizável"], reviews: []},
  { id: 121, name: "Esponja Polvo de Silicone para Limpeza Facial", tag: "Skincare", category: "feminino", oldPrice: 15, price: 490, rating: 4.8, salesCount: 60000, description: "Um polvinho fofo para espumar seu sabonete facial. Você vai usar 3 vezes e largar na pia.", image: "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?auto=format&fit=crop&q=80&w=400", specs: ["Silicone Macio", "Espuma Rápida", "Massagem"], reviews: []},
  { id: 122, name: "Touca de Cetim Anti-Frizz", tag: "Cabelo Blindado", category: "feminino", oldPrice: 20, price: 890, rating: 4.9, salesCount: 75000, description: "Durma feia, acorde linda. Protege os cachos e evita o frizz.", image: "https://images.unsplash.com/photo-1619551734325-81aaf323686c?auto=format&fit=crop&q=80&w=400", specs: ["Dupla Face", "Ajustável", "Brilhante"], reviews: [
    {name:"Cacheada",rating:5,date:"1 mês",comment:"Marido assustou de noite, achou que tava dormindo com uma cozinheira. Mas o cabelo no dia seguinte compensa o bullying."}
  ]},
  { id: 123, name: "Depilador Cristal Mágico Indolor", tag: "Bruxaria", category: "feminino", oldPrice: 45, price: 1890, rating: 3.5, salesCount: 21000, description: "Esfregue na perna até o pelo sumir (junto com 3 camadas de pele).", image: "/depilador_cristal.webp", specs: ["Nanotecnologia", "Esfoliante", "Reutilizável"], reviews: [
    {name:"Sem Pele",rating:2,date:"3 dias",comment:"O pelo saiu? Saiu. Minha epiderme também. Arde no banho que é uma beleza."}
  ]},
  { id: 124, name: "Clareador Dental Carvão Ativado em Pó", tag: "Dente Preto", category: "feminino", oldPrice: 35, price: 1490, rating: 4.1, salesCount: 18000, description: "Pó preto que suja a pia toda mas promete clarear seus dentes. Confia.", image: "/clareador_carvao.webp", specs: ["100% Natural", "Carvão do Coco", "Sabor Menta"], reviews: []},
  { id: 125, name: "Sutiã Adesivo Invisível Push Up", tag: "Sustentação", category: "feminino", oldPrice: 40, price: 1990, rating: 4.3, salesCount: 50000, description: "O famoso 'orelha de coelho'. Levanta tudo. Só não pode suar, senão cai na festa.", image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=400", specs: ["Silicone Adesivo", "Sem Alças", "Reutilizável"], reviews: []},
  { id: 126, name: "Aparelho Anti Ronco Clip Nasal Magnético", tag: "Casamento Salvo", category: "masculino", oldPrice: 20, price: 690, rating: 2.8, salesCount: 35000, description: "Um imã pro seu nariz parar de roncar. Spoiler: você vai roncar com o imã no nariz.", image: "https://images.unsplash.com/photo-1512438248247-f0f2a5a8b7f0?auto=format&fit=crop&q=80&w=400", specs: ["Silicone", "Ímãs nas pontas", "Estojo Incluso"], reviews: [
    {name:"Esposa Desesperada",rating:1,date:"1 semana",comment:"Meu marido engoliu isso enquanto dormia e continuou roncando. Tivemos que ir pro hospital."}
  ]},
  { id: 127, name: "Lixa de Pé Elétrica Removedor de Calos", tag: "Pé de Princesa", category: "feminino", oldPrice: 60, price: 2890, rating: 4.6, salesCount: 29000, description: "Faz nevar poeira de pele morta pela casa toda. Seus pés ficarão lisinhos.", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400", specs: ["Recarregável", "2 Lixas", "Sucção de Pó"], reviews: []},
  { id: 128, name: "Pincel de Maquiagem Sereia Kit 10 Peças", tag: "Make Magia", category: "feminino", oldPrice: 45, price: 2290, rating: 4.8, salesCount: 41000, description: "Cabos em formato de cauda de sereia. As cerdas caem um pouco, mas são lindos.", image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&q=80&w=400", specs: ["Cerdas Sintéticas", "Cabo Furta-cor", "10 Modelos"], reviews: []},
  { id: 129, name: "Óculos de Sol Thug Life Pixelado", tag: "Turn Down For What", category: "gamer", oldPrice: 25, price: 1190, rating: 4.9, salesCount: 15000, description: "Coloque e a música toca automaticamente na sua cabeça. Meme clássico.", image: "https://images.unsplash.com/photo-1572631382901-cf1a0a6087cb?auto=format&fit=crop&q=80&w=400", specs: ["Lente Preta", "Pixelado 8-bit", "Proteção Nenhuma"], reviews: []},
  { id: 130, name: "Máquina de Cortar Cabelo Acabamento Dragão", tag: "Barbeiro de Favela", category: "masculino", oldPrice: 80, price: 3490, rating: 4.7, salesCount: 95000, description: "Faz o degradê, corta o pelo do peito e esculpe a barba. O corpo de metal dourado impõe respeito.", image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=400", specs: ["Bateria 18650", "Pentes Inclusos", "Estampa de Dragão"], reviews: [
    {name:"Barbeiro Zé",rating:5,date:"3 semanas",comment:"Faz a régua perfeita. Corta mais que peixeira de baiano."}
  ]},
  { id: 131, name: "Palmilha de Silicone Aumento de Altura 3cm", tag: "Tinder Honesto", category: "masculino", oldPrice: 30, price: 1490, rating: 4.5, salesCount: 23000, description: "Cansou de ter 1,68m? Chegue aos gloriosos 1,71m sem cirurgia. Não tire o sapato no encontro.", image: "/palmilha_altura.webp", specs: ["Silicone Macio", "Invisível", "Amortecimento"], reviews: []},
  { id: 132, name: "Cinta Modeladora Queima Gordura Efeito Sauna", tag: "Suador", category: "feminino", oldPrice: 40, price: 1990, rating: 4.4, salesCount: 56000, description: "Você não queima gordura, só desidrata suando em bicas, mas a barriga some na calça.", image: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&q=80&w=400", specs: ["Neoprene", "Fecho Velcro", "Efeito Térmico"], reviews: []},
  { id: 133, name: "Suporte de Celular Pescoço Articulado Preguiçoso", tag: "Netflix na Cama", category: "lazer", oldPrice: 35, price: 1590, rating: 4.7, salesCount: 38000, description: "Enrole no pescoço e assista deitado sem derrubar o celular na cara.", image: "https://images.unsplash.com/photo-1585298723682-7115561c51b7?auto=format&fit=crop&q=80&w=400", specs: ["Haste Flexível", "Rotação 360", "Espuma no Pescoço"], reviews: [
    {name:"Preguiça Viva",rating:5,date:"1 mês",comment:"Minha papada agradece. Pareço um ciborgue na cama mas o conforto é inegável."}
  ]},
  { id: 134, name: "Fita Led RGB 5 Metros com Controle Bluetooth", tag: "Quarto Gamer", category: "gamer", oldPrice: 50, price: 2390, rating: 4.8, salesCount: 110000, description: "A fita de LED que falta na sanca do seu gesso para o quarto parecer uma boate.", image: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3?auto=format&fit=crop&q=80&w=400", specs: ["5 Metros", "RGB 5050", "App Celular", "Fonte Bivolt"], reviews: []},
  { id: 135, name: "Luz de Selfie Ring Light para Celular", tag: "Influencer", category: "feminino", oldPrice: 20, price: 890, rating: 4.6, salesCount: 78000, description: "Prende no celular e te deixa com aquele reflexo branco no olho.", image: "/ring_light_celular.webp", specs: ["Bateria USB", "3 Níveis Luz", "Clip Universal"], reviews: []},
  { id: 136, name: "Massageador Facial Rolo de Pedra Jade", tag: "Skincare Rica", category: "feminino", oldPrice: 25, price: 1190, rating: 4.5, salesCount: 42000, description: "Dizem que desincha o rosto. Na verdade é só uma pedra fria gostosinha de rolar na cara.", image: "/rolo_jade.webp", specs: ["Pedra Jade Falsa", "Rolo Duplo", "Anti-Idade (confia)"], reviews: []},
  { id: 137, name: "Escova Secadora Modeladora Alisadora 3 em 1", tag: "Cabelo Prático", category: "feminino", oldPrice: 120, price: 5990, rating: 4.8, salesCount: 89000, description: "Faz um barulho de turbina de avião, esquenta até derreter o cabo, mas seca rápido.", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400", specs: ["1200W", "Íons", "Cabo Giratório"], reviews: []},
  { id: 138, name: "Copo Térmico Stanley Falso (Mantém Frio 2 min)", tag: "Faria Limer", category: "masculino", oldPrice: 45, price: 2990, rating: 4.2, salesCount: 150000, description: "Vem escrito Stanley torto. A cerveja esquenta igual copo de requeijão, mas tem estilo.", image: "/copo_stanley.webp", specs: ["Inox 304", "Tampa e Abridor", "Logotipo Pirata"], reviews: [
    {name:"Zé Breja",rating:5,date:"2 semanas",comment:"É falso mas o pessoal do churrasco tava bêbado e achou que eu era rico."}
  ]},
  { id: 139, name: "Abridor de Garrafa Magnético Automático", tag: "Barzinho", category: "masculino", oldPrice: 35, price: 1690, rating: 4.8, salesCount: 27000, description: "Aperta na tampa e ploft, abre sem amassar a chapinha. Mágica para os pinguços.", image: "/abridor_garrafa.webp", specs: ["Aço Inox", "Ímã Integrado", "Automático"], reviews: []},
  { id: 140, name: "Garrafa de Água Squeeze Motivacional 2 Litros", tag: "Hidratação", category: "feminino", oldPrice: 35, price: 1790, rating: 4.7, salesCount: 120000, description: "'9h: Bom dia!', '15h: Quase lá!'. Beber água nunca precisou de tanto coaching.", image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&q=80&w=400", specs: ["2 Litros", "Marcador de Horário", "Cores Degradê", "Canudo de Silicone"], reviews: []},
  { id: 141, name: "Descascador de Alho de Silicone Mágico", tag: "Dona de Casa", category: "lazer", oldPrice: 15, price: 490, rating: 4.5, salesCount: 18000, description: "Um tubo de silicone. Você enfia o alho, rola na mesa, e sai descascado. Genial.", image: "/descascador_alho.webp", specs: ["Silicone Flexível", "Sem cheiro na mão", "Fácil de Limpar"], reviews: []},
  { id: 142, name: "Luva Tira Pelos Magnética para Gatos", tag: "Mãe de Pet", category: "lazer", oldPrice: 20, price: 990, rating: 4.8, salesCount: 65000, description: "Você faz carinho no gato e arranca pelo suficiente pra tricotar outro gato.", image: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400", specs: ["Pinos de Silicone", "Mão Direita", "Fecho Velcro"], reviews: []},
  { id: 143, name: "Bolinha Maluca Mágica Pet que Anda Sozinha", tag: "Diversão Pet", category: "lazer", oldPrice: 40, price: 1890, rating: 4.4, salesCount: 22000, description: "Ela vibra, rola pra todo lado e prende embaixo do sofá em 5 minutos.", image: "https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80&w=400", specs: ["Capas Laváveis", "Movimento Aleatório", "Pilha AA"], reviews: []},
  { id: 144, name: "Pulseira Magnética Porta Parafusos", tag: "Montador", category: "masculino", oldPrice: 25, price: 1290, rating: 4.7, salesCount: 19000, description: "Coloque no pulso e nunca mais perca aquele parafuso minúsculo no tapete.", image: "/pulseira_magnetica.webp", specs: ["Ímãs Fortes", "Ajustável", "Nylon Resistente"], reviews: []},
  { id: 145, name: "Fone de Ouvido Bluetooth Orelha de Gato RGB", tag: "E-Girl", category: "gamer", oldPrice: 90, price: 4590, rating: 4.8, salesCount: 42000, description: "A orelhinha pisca no ritmo da música. Qualidade de som duvidosa, mas esteticamente fofo.", image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&q=80&w=400", specs: ["RGB nas Orelhas", "Bluetooth 5.0", "Almofadas Macias"], reviews: []},
  { id: 146, name: "Mini Teclado Wireless Touchpad Smart TV", tag: "TV Box", category: "gamer", oldPrice: 45, price: 2190, rating: 4.9, salesCount: 88000, description: "O controle oficial de quem assiste filme pirata na TV Box. As teclas brilham.", image: "https://images.unsplash.com/photo-1584727638096-042c45049ebe?auto=format&fit=crop&q=80&w=400", specs: ["Touchpad Integrado", "Teclas RGB", "Bateria Recarregável"], reviews: [
    {name:"Pirata",rating:5,date:"3 meses",comment:"Agora posso digitar o nome do filme no YouCine sem demorar 2 anos com a setinha do controle."}
  ]},
  { id: 147, name: "Trimmer Aparador de Pelos Nariz e Orelha", tag: "Higiene Masculina", category: "masculino", oldPrice: 25, price: 1190, rating: 4.6, salesCount: 36000, description: "Tira aquelas teias de aranha do nariz sem dor. Essencial após os 30 anos.", image: "https://images.unsplash.com/photo-1621607512214-68297480165e?auto=format&fit=crop&q=80&w=400", specs: ["Lâmina Rotativa", "Seguro e Indolor", "Pilha AA"], reviews: []},
  { id: 148, name: "Chaveiro Canivete Mini Multiuso Sobrevivência", tag: "Bear Grylls de Apartamento", category: "masculino", oldPrice: 20, price: 890, rating: 4.7, salesCount: 28000, description: "Corta papelão da Amazon e abre garrafa de cerveja. O kit completo de sobrevivência urbana.", image: "https://images.unsplash.com/photo-1549488344-1f9b8d2bd1f3?auto=format&fit=crop&q=80&w=400", specs: ["Aço Inox", "Formato de Chave", "Lâmina Oculta"], reviews: []},
  { id: 149, name: "Tripé Octopus Flexível para Celular", tag: "Gambiarras de Foto", category: "lazer", oldPrice: 25, price: 1090, rating: 4.5, salesCount: 51000, description: "Parece um polvo de espuma. Você pendura ele em galhos e grades e reza pro celular não cair.", image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?auto=format&fit=crop&q=80&w=400", specs: ["Pernas Flexíveis", "Base Rotativa", "Para Smartphone"], reviews: []},
  { id: 150, name: "Caneta Teste Testador de Tensão Energia Elétrica", tag: "Eletricista Amador", category: "masculino", oldPrice: 15, price: 790, rating: 4.9, salesCount: 41000, description: "Apita e acende luz vermelha se tiver energia. Evita choques e penteados estáticos.", image: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&q=80&w=400", specs: ["Alerta Sonoro", "Luz Led", "Sem Contato Metálico"], reviews: []},
  { id: 151, name: "Mop Giratório Balde Esfregão Limpeza Prática", tag: "Dona de Casa Rica", category: "lazer", oldPrice: 80, price: 3990, rating: 4.8, salesCount: 95000, description: "A centrífuga plástica gira a vassoura e você não suja a mão. Revolução na faxina.", image: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&q=80&w=400", specs: ["Cabo Inox", "Refil Microfibra", "Centrífuga Plástica"], reviews: []},
  { id: 152, name: "Ralador Fatiador Cortador de Legumes 3 em 1 Manivela", tag: "Cozinha Prática", category: "lazer", oldPrice: 65, price: 2990, rating: 4.7, salesCount: 31000, description: "Rala queijo e corta batata girando a manivela. O ruim é lavar os furinhos depois.", image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?auto=format&fit=crop&q=80&w=400", specs: ["3 Lâminas Cilindro", "Base com Ventosa", "Plástico ABS"], reviews: []},
  { id: 153, name: "Kit 5 Pares de Cílios Postiços Magnéticos", tag: "Piscada Forte", category: "feminino", oldPrice: 30, price: 1590, rating: 4.6, salesCount: 26000, description: "Passe o delineador magnético, e o cílio gruda feito imã de geladeira. Mágica pura.", image: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&q=80&w=400", specs: ["Não usa cola", "Delineador Magnético", "Pinça Inclusa"], reviews: []},
  { id: 154, name: "Faixa de Cabelo para Maquiagem Orelha de Coelho", tag: "Skincare", category: "feminino", oldPrice: 15, price: 690, rating: 4.9, salesCount: 54000, description: "Segura a franja pra você lavar o rosto sem molhar o cabelo. E ainda fica fofa.", image: "https://images.unsplash.com/photo-1522337660859-02fbefca4702?auto=format&fit=crop&q=80&w=400", specs: ["Tecido Atoalhado", "Elástico Flexível", "Orelhinhas"], reviews: []},
  { id: 155, name: "Cama Nuvem Pet Pelúcia Anti Stress", tag: "Luxo Canino", category: "lazer", oldPrice: 70, price: 3590, rating: 4.8, salesCount: 33000, description: "Tão macia que você vai querer expulsar o cachorro e dormir nela.", image: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?auto=format&fit=crop&q=80&w=400", specs: ["Pelúcia Longa", "Fundo Antiderrapante", "Lavável"], reviews: []},
  { id: 156, name: "Lente Macro e Fisheye 3 em 1 para Celular", tag: "Fotógrafo de Celular", category: "lazer", oldPrice: 20, price: 990, rating: 4.5, salesCount: 17000, description: "Presilha com três lentes de vidro. A lente macro funciona de verdade pra tirar foto de formiga.", image: "https://images.unsplash.com/photo-1616423640778-28d1b53229bd?auto=format&fit=crop&q=80&w=400", specs: ["Macro", "Fisheye 180°", "Wide Angle", "Clip Universal"], reviews: []},
  { id: 157, name: "Mini Seladora de Plástico a Pilha", tag: "Salgadinho Murcho Nunca Mais", category: "lazer", oldPrice: 15, price: 790, rating: 4.2, salesCount: 22000, description: "Derrete o plástico pra fechar o pacote de Ruffles que você não aguentou comer todo.", image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=400", specs: ["Fio Quente", "Base com Ímã", "Funciona com 2 Pilhas AA"], reviews: []},
  { id: 158, name: "Afiador Amolador de Facas Profissional 3 Fases", tag: "MasterChef em Casa", category: "lazer", oldPrice: 25, price: 1290, rating: 4.8, salesCount: 45000, description: "Passa a faca e ela corta até o vento. 3 pedras diferentes pra afiar a lâmina cega da cozinha.", image: "https://images.unsplash.com/photo-1593618998160-e34014e67546?auto=format&fit=crop&q=80&w=400", specs: ["Cerâmica", "Aço Tungstênio", "Pedra Diamantada", "Cabo Ergonômico"], reviews: []},
  { id: 159, name: "Caneta Fofa Apagável Bichinhos", tag: "Papelaria", category: "feminino", oldPrice: 15, price: 590, rating: 4.8, salesCount: 28000, description: "Caneta em gel que apaga com a borracha na ponta. Perfeito pra quem erra muito na vida.", image: "https://images.unsplash.com/photo-1585336261022-680e295ce3fe?auto=format&fit=crop&q=80&w=400", specs: ["Tinta Gel Azul/Preta", "Borracha de Fricção", "Estampa Kawaii"], reviews: []},
  { id: 160, name: "Máscara de Dormir 3D Olhos de Sapo", tag: "Sono Engraçado", category: "feminino", oldPrice: 18, price: 790, rating: 4.7, salesCount: 14000, description: "Máscara do Pepe the Frog. Você pode abrir e fechar os olhos de mentira. Inútil porém hilário.", image: "https://images.unsplash.com/photo-1520206183501-b80df61043c2?auto=format&fit=crop&q=80&w=400", specs: ["Pelúcia", "Olhos Articulados", "Bloqueio de Luz Total"], reviews: []},
  { id: 161, name: "Mini Game Sup 400 em 1 Clássicos", tag: "Nostalgia de Bolso", category: "gamer", oldPrice: 45, price: 2190, rating: 4.8, salesCount: 75000, description: "Tem Super Mario pirata, Contra e Tetris. Bateria de celular antigo e tela colorida.", image: "https://images.unsplash.com/photo-1531525645387-7f14be1bdbbd?auto=format&fit=crop&q=80&w=400", specs: ["400 Jogos na Memória", "Cabo AV para TV", "Bateria Recarregável"], reviews: []},
  { id: 162, name: "Molde Modelador para Fazer Hambúrguer Caseiro", tag: "Lanches", category: "alimentos", oldPrice: 20, price: 890, rating: 4.6, salesCount: 13000, description: "Prensa a carne moída pra ficar redondinha igual de hamburgueria artesanal. Chega de carne disforme.", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=400", specs: ["Alumínio Fundido", "Cabo de Madeira", "Fundo Removível"], reviews: []},
  { id: 163, name: "Ferrari LaFerrari 6.3 V12", tag: "Ostentação Pura", category: "veiculos", oldPrice: 35000000, price: 2999000000, rating: 5.0, salesCount: 2, description: "Apenas para quem quer chegar no mercado de bairro chamando atenção. IPVA não incluso.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/LaFerrari_in_Beverly_Hills_%2814563979888%29.jpg/960px-LaFerrari_in_Beverly_Hills_%2814563979888%29.jpg", specs: ["Motor V12 Híbrido", "963 cv", "0-100 em 3s", "Cor Vermelho Rosso Corsa"], reviews: []},
  { id: 164, name: "Porsche 911 GT3 RS", tag: "Foguete de Pista", category: "veiculos", oldPrice: 2500000, price: 185000000, rating: 4.9, salesCount: 15, description: "Pra você que acha que a avenida da sua cidade é o circuito de Nürburgring. O aerofólio dá pra usar de mesa.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Porsche_992_GT3_1X7A0323.jpg/960px-Porsche_992_GT3_1X7A0323.webp", specs: ["Motor 4.0 Boxer", "525 cv", "Aerodinâmica Extrema"], reviews: []},
  { id: 165, name: "Mercedes-Benz G-Class G63 AMG", tag: "Geladeira V8", category: "veiculos", oldPrice: 1800000, price: 125000000, rating: 4.8, salesCount: 40, description: "Aerodinâmica de um tijolo, potência de um tanque. Perfeito para o shopping e pra fugir de zumbis.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/3/38/Mercedes-Benz_W463_G_350_BlueTEC_01.jpg/960px-Mercedes-Benz_W463_G_350_BlueTEC_01.webp", specs: ["Motor V8 Biturbo", "Tração 4x4", "Interior em Couro Nappa"], reviews: []},
  { id: 166, name: "Tesla Model S Plaid", tag: "Choque do Trovão", category: "veiculos", oldPrice: 900000, price: 65000000, rating: 4.6, salesCount: 120, description: "Mais rápido que a internet da sua operadora. Dirige sozinho enquanto você joga Candy Crush.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9e/Tesla_Model_S_%28Facelift_ab_04-2016%29_%28cropped%29.jpg/960px-Tesla_Model_S_%28Facelift_ab_04-2016%29_%28cropped%29.jpg", specs: ["1020 cv", "0-100 em 2.1s", "Volante Yoke", "Piloto Automático"], reviews: []},
  { id: 167, name: "Ônibus Marcopolo Paradiso G8 1800 DD", tag: "Rei da Estrada", category: "veiculos", oldPrice: 1500000, price: 95000000, rating: 4.7, salesCount: 5, description: "Vai viajar com a família toda? Leva os primos, a sogra, o papagaio e ainda sobra espaço.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/50/Ausden_Clark_Executive_Coach_in_Black_and_Pink_Livery.jpg/960px-Ausden_Clark_Executive_Coach_in_Black_and_Pink_Livery.webp", specs: ["Double Decker", "Poltronas Leito Cama", "Wi-Fi e Ar Condicionado"], reviews: []},
  { id: 168, name: "Toyota Hilux SW4", tag: "AgroBoy", category: "veiculos", oldPrice: 400000, price: 32000000, rating: 4.5, salesCount: 500, description: "O carro oficial de quem ouve sertanejo universitário e nunca pisou na terra.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg/960px-2016_Toyota_HiLux_Invincible_D-4D_4WD_2.4_Front.jpg", specs: ["Motor 2.8 Diesel", "7 Lugares", "Capota que nunca suja"], reviews: []},
  { id: 169, name: "Moto Honda CBR 1000RR Fireblade", tag: "Corta Giro", category: "veiculos", oldPrice: 120000, price: 8900000, rating: 4.9, salesCount: 85, description: "Pra você acordar o bairro inteiro às 3 da manhã no domingo. É a lenda das rodovias.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/2024_Honda_CBR1000RR-R_Fireblade_SP.jpg/960px-2024_Honda_CBR1000RR-R_Fireblade_SP.webp", specs: ["Motor 1000cc", "Controle de Tração", "Freios Brembo"], reviews: []},
  { id: 170, name: "Moto BMW S1000RR", tag: "Olho Grego", category: "veiculos", oldPrice: 140000, price: 10500000, rating: 4.9, salesCount: 110, description: "O pesadelo dos radares de velocidade. Chega a 300km/h antes de você piscar.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/BMW_S_1000_RR_-_BMW_M_1000_RR_50_Years_M_%2822121615413%29.jpg/960px-BMW_S_1000_RR_-_BMW_M_1000_RR_50_Years_M_%2822121615413%29.jpg", specs: ["Motor 4 Cilindros", "207 cv", "ShiftCam Technology"], reviews: []},
  { id: 171, name: "Lamborghini Aventador SVJ", tag: "Nave Alienígena", category: "veiculos", oldPrice: 4000000, price: 320000000, rating: 5.0, salesCount: 3, description: "Chama mais atenção que trio elétrico. Tão baixo que raspa no protetor de lombada do condomínio.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/ed/Lamborghini_Aventador_S_%2844554%29.jpg/960px-Lamborghini_Aventador_S_%2844554%29.jpg", specs: ["V12 Aspirado", "Portas Tesoura", "Asa Traseira Ativa"], reviews: []},
  { id: 172, name: "Fiat Uno Mille com Escada", tag: "Velocidade da Luz", category: "veiculos", oldPrice: 50000, price: 1200000, rating: 5.0, salesCount: 9999, description: "Veículo de alta performance das firmas de telefonia. Ultrapassa Ferrari, Porsche, F1, e jato comercial.", image: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6a/2011_Fiat_Uno_1.4_Attractive.jpg/960px-2011_Fiat_Uno_1.4_Attractive.jpg", specs: ["Escada de Alumínio (+500cv)", "Pneu Careca", "Cheiro de Pinga e Fio de Cobre"], reviews: []},
  { id: 173, name: "Gato Net (Apenas o Gato)", tag: "Sinal Forte", category: "ilicitos", oldPrice: 350, price: 9900, rating: 4.9, salesCount: 8400, description: "Um felino folgado treinado para sentar em cima do roteador e esquentar a internet. Não rouba sinal, só ração.", image: "/gato_net_1784734555451.webp", specs: ["Persa Laranja", "Ronrona a 5Ghz", "Usa a caixa de areia"], reviews: [
    {name:"Dona Fátima",rating:5,date:"2 dias",comment:"O gato chegou inteiro, mas ele derrubou meu vaso de planta e agora tá exigindo sachê premium. A internet continua ruim, mas ele é fofo."},
    {name:"João do Caminhão",rating:4,date:"1 semana",comment:"Funciona muito bem. Ele dorme no roteador e o Wi-Fi pega até no vizinho por causa da energia estática dos pelos. Genial!"}
  ]},
  { id: 174, name: "Lava-Jato (Kit Balde e Sabão)", tag: "Dinheiro Limpo", category: "ilicitos", oldPrice: 85, price: 3500, rating: 4.7, salesCount: 15200, description: "Lave seu carro ou o seu dinheiro sujo (nota: o dinheiro de papel pode rasgar se você esfregar muito forte).", image: "/lava_jato_1784734571278.webp", specs: ["Balde Amarelo 10L", "Sabão de Coco", "Esponja Dupla Face"], reviews: [
    {name:"Político Honesto",rating:5,date:"1 mês",comment:"Comprei pra testar e minha conta bancária em offshore nunca esteve tão limpa e cheirosa! Recomendo esfregar as notas de 100 com cuidado."},
    {name:"Sérgio M.",rating:5,date:"3 semanas",comment:"As provas foram lavadas e saíram limpinhas, sem manchas. Produto de altíssima qualidade investigativa."}
  ]},
  { id: 175, name: "Esquema de Pirâmide (Geometria 3D)", tag: "Fique Rico Fácil", category: "ilicitos", oldPrice: 150, price: 4900, rating: 5.0, salesCount: 99999, description: "Um peso de papel em formato de pirâmide egípcia. Chame 3 amigos para admirar sua mesa e mude de vida.", image: "/esquema_piramide_1784734584998.webp", specs: ["Polímero Dourado", "Base Triangular", "Olho que tudo vê"], reviews: [
    {name:"Faraó do Pix",rating:5,date:"Ontem",comment:"Mostrei pra dois amigos, eles mostraram pra mais dois, e agora a gente construiu a esfinge no quintal de casa. Sucesso total!"},
    {name:"Primo Não Tão Rico",rating:1,date:"1 semana",comment:"Comprei achando que ia aposentar aos 30. Tudo que ganhei foi uma pirâmide de plástico encardida e perdi 4 amigos."}
  ]},
  { id: 176, name: "Baseado em Fatos Reais (Roteiro)", tag: "Bob Marley Chora", category: "ilicitos", oldPrice: 420, price: 9900, rating: 5.0, salesCount: 69420, description: "Um rolo de papel com a história da sua vida. Muito relaxante de ler, mas péssimo para os pulmões se tentar acender.", image: "/baseado_roteiro_cartoon.webp", specs: ["100% Papel Reciclado", "Livre de Fumaça", "Paz e Amor"], reviews: [
    {name:"Zeca",rating:5,date:"Ontem",comment:"Tentei acender pra relaxar lendo a história. Quase botei fogo no meu sofá e a história do roteiro era um tédio. 5 estrelas pela brisa da fumaça do papel sulfite."},
    {name:"Cineasta Frustrado",rating:5,date:"4 dias",comment:"Melhor roteiro que já vi. Tem começo, meio, e uma tosse violenta no final."}
  ]}
];
