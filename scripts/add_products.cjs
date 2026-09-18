const fs = require('fs');

const items = [
  {
    name: "Massageador de Pescoço 8 Pontos Aquecimento Relaxamento",
    tag: "Relaxamento",
    category: "tecnologia",
    oldPrice: 299,
    price: 149.9,
    rating: 4.8,
    salesCount: 300,
    description: "Massagem e alívio de tensão para ombros e pescoço. Diga adeus ao estresse.",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600",
    specs: ["8 Pontos", "Aquecimento", "Bivolt"],
    reviews: []
  },
  {
    name: "Kit Linha Completa Explosão de Azeite de Oliva bn.Cachos",
    tag: "Beleza",
    category: "feminina",
    oldPrice: 120,
    price: 89.9,
    rating: 4.9,
    salesCount: 450,
    description: "Umectação com óleo de abacate e azeite de oliva para cachos definidos.",
    image: "https://images.unsplash.com/photo-1526947425960-945c6e72858f?auto=format&fit=crop&q=80&w=600",
    specs: ["Para Cachos", "Óleo de Abacate", "Azeite de Oliva"],
    reviews: []
  },
  {
    name: "Pneu Aro 14 Firestone F-600 175/65 R14 82T - 2 Unidades",
    tag: "Automotivo",
    category: "veiculos",
    oldPrice: 450,
    price: 350,
    rating: 4.7,
    salesCount: 1200,
    description: "Pneus Firestone para segurança e durabilidade. O par perfeito pro seu carro.",
    image: "/pneus.png",
    specs: ["Aro 14", "175/65 R14", "2 Unidades"],
    reviews: []
  },
  {
    name: "Fogão 5 Bocas Atlas Atenas com Mesa de Vidro",
    tag: "Eletrodomésticos",
    category: "tecnologia",
    oldPrice: 1500,
    price: 1200,
    rating: 4.9,
    salesCount: 200,
    description: "Mesa de vidro, a gás, bivolt. Deixe sua cozinha mais chique e moderna.",
    image: "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
    specs: ["5 Bocas", "Mesa de Vidro", "Bivolt"],
    reviews: []
  },
  {
    name: "Bolsa Feminina De Ombro e Transversal em PU Diagonal",
    tag: "Moda",
    category: "feminina",
    oldPrice: 150,
    price: 79.9,
    rating: 4.6,
    salesCount: 800,
    description: "Tendência na moda atual. Perfeita para qualquer ocasião.",
    image: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?auto=format&fit=crop&q=80&w=600",
    specs: ["Couro PU", "Transversal", "Espaçosa"],
    reviews: []
  },
  {
    name: "Vestido Indiano Curto Tribal Elegance Rodadinho",
    tag: "Moda Verão",
    category: "feminina",
    oldPrice: 99,
    price: 65,
    rating: 4.5,
    salesCount: 650,
    description: "Vestido verão com estampa localizada, alcinha ajustável.",
    image: "https://images.unsplash.com/photo-1515347619362-7dd3d51eb99a?auto=format&fit=crop&q=80&w=600",
    specs: ["Verão", "Alça Ajustável", "Tribal"],
    reviews: []
  },
  {
    name: "Kit 10 Peças Roupas Infantil Menina Sortido Verão",
    tag: "Infantil",
    category: "feminina",
    oldPrice: 180,
    price: 120,
    rating: 4.8,
    salesCount: 1100,
    description: "5 Camisetas e 5 Shorts pra criançada brincar confortável no calor.",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&q=80&w=600",
    specs: ["10 Peças", "Verão", "Sortido"],
    reviews: []
  },
  {
    name: "Combo Kemei PRO KM-1689 Kit Profissional Barba e Cabelo",
    tag: "Beleza Masculina",
    category: "masculino",
    oldPrice: 200,
    price: 110,
    rating: 4.7,
    salesCount: 3000,
    description: "Máquina de corte e acabamento pra lançar o degradê perfeito.",
    image: "https://images.unsplash.com/photo-1599305090598-fe179d501227?auto=format&fit=crop&q=80&w=600",
    specs: ["Sem Fio", "Corte e Acabamento", "Profissional"],
    reviews: []
  },
  {
    name: "Depilador Elétrico Feminino Recarregável Navalha Dupla",
    tag: "Cuidados Pessoais",
    category: "feminina",
    oldPrice: 89,
    price: 45,
    rating: 4.5,
    salesCount: 900,
    description: "Removedor de pelos prático, indolor e fácil de carregar na bolsa.",
    image: "https://images.unsplash.com/photo-1556228578-0d85b1a4d571?auto=format&fit=crop&q=80&w=600",
    specs: ["Recarregável", "Navalha Dupla", "Portátil"],
    reviews: []
  },
  {
    name: "Kit 5 Blusas Femininas T-Shirt Malha Canelada Premium",
    tag: "Moda Casual",
    category: "feminina",
    oldPrice: 150,
    price: 99.9,
    rating: 4.8,
    salesCount: 1500,
    description: "Malha quentinha, veste super bem. Básicas e essenciais.",
    image: "https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&q=80&w=600",
    specs: ["5 Peças", "Malha Canelada", "Premium"],
    reviews: []
  },
  {
    name: "Scarpin Feminino Duas Fivelas Bellamore Salto Baixo",
    tag: "Calçados",
    category: "feminina",
    oldPrice: 199,
    price: 130,
    rating: 4.6,
    salesCount: 420,
    description: "Confortável, chique e com salto de 5cm. Vai bem com tudo.",
    image: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&q=80&w=600",
    specs: ["Salto 5cm", "Duas Fivelas", "Elegante"],
    reviews: []
  },
  {
    name: "Kit Óleos Africanos Reparador de Pontas bn.Cachos",
    tag: "Cabelos Perfeitos",
    category: "feminina",
    oldPrice: 85,
    price: 55,
    rating: 4.9,
    salesCount: 600,
    description: "Poderosa umectação para fechar pontas duplas e nutrir os fios.",
    image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&q=80&w=600",
    specs: ["Reparador de Pontas", "Nutrição", "Africano"],
    reviews: []
  }
];

const filePath = 'src/productsData.js';
let content = fs.readFileSync(filePath, 'utf8');

// Find the end of the products array
const lastBracketIndex = content.lastIndexOf('];');
if (lastBracketIndex === -1) {
  console.log("Could not find the end of the products array.");
  process.exit(1);
}

// Extract existing max ID
let maxId = 65; // It's currently 65

items.forEach((item, index) => {
  item.id = maxId + index + 1;
});

let itemsString = items.map(item => '  ' + JSON.stringify(item, null, 0).replace(/"([^"]+)":/g, '$1:')).join(',\n');
itemsString = ',\n' + itemsString;

const newContent = content.slice(0, lastBracketIndex) + itemsString + '\n];' + content.slice(lastBracketIndex + 2);

fs.writeFileSync(filePath, newContent);
console.log("Products added!");
