import { useState, useRef, useCallback, useEffect } from "react";
import * as XLSX from "xlsx";

/* ═══════════════════════════════════════════════════════════════════════
   BASE DE DADOS — FRANQUEADOS (pré-setada com Base_Franqueados.xlsx)
   Chave: CNPJ com máscara  →  { loja, razao, cnpj, endereco, bairro, cidade, uf, cep }
═══════════════════════════════════════════════════════════════════════ */
const FRANQUEADOS = {"41.720.736/0001-11":{"loja":"Di Blasi Franchising","razao":"Di Blasi Franchising Ltda","cnpj":"41.720.736/0001-11","endereco":"Rua Dalcídio Jurandir, 255 Loja 149","bairro":"Barra da Tijuca","cidade":"Rio de Janeiro","uf":"RJ","cep":"22631250"},"28.021.953/0001-55":{"loja":"Di Blasi Barra","razao":"AM Comércio de Alimentos e Bebidas Ltda","cnpj":"28.021.953/0001-55","endereco":"Avenida Ministro Afrânio Costa, 91 Loja P","bairro":"Barra da Tijuca","cidade":"Rio de Janeiro","uf":"RJ","cep":"22631000"},"38.064.672/0001-33":{"loja":"Di Blasi Recreio","razao":"AVG Comércio de Alimentos e Bebidas Ltda","cnpj":"38.064.672/0001-33","endereco":"Avenida das Américas, 13685 Loja 134","bairro":"Recreio dos Bandeirantes","cidade":"Rio de Janeiro","uf":"RJ","cep":"22790701"},"41.216.909/0001-69":{"loja":"Di Blasi Freguesia","razao":"JBTI Comércio de Alimentos e Bebidas Eireli","cnpj":"41.216.909/0001-69","endereco":"Avenida Geremário Dantas, 832 Loja A","bairro":"Freguesia de Jacarepaguá","cidade":"Rio de Janeiro","uf":"RJ","cep":"22743010"},"43.577.150/0001-75":{"loja":"Di Blasi Icaraí","razao":"GAP Comércio Ltda","cnpj":"43.577.150/0001-75","endereco":"Rua Lopes Trovão, 419 NA","bairro":"Icaraí","cidade":"Niterói","uf":"RJ","cep":"24220070"},"43.444.183/0001-47":{"loja":"Di Blasi Leblon","razao":"MGM Comércio de Alimentos e Bebidas Ltda","cnpj":"43.444.183/0001-47","endereco":"Rua Doutor Marques Canário, 100 Loja B","bairro":"Leblon","cidade":"Rio de Janeiro","uf":"RJ","cep":"22441060"},"44.006.354/0001-19":{"loja":"Di Blasi Rio2 (antigo)","razao":"Buena Pizzeria Ltda","cnpj":"44.006.354/0001-19","endereco":"Avenida Embaixador Abelardo Bueno, 3180 Loja 112","bairro":"Curicica","cidade":"Rio de Janeiro","uf":"RJ","cep":"22775040"},"55.251.951/0001-25":{"loja":"Di Blasi Rio2","razao":"Rio 2 Pizzas Comercio de Alimentos e Bebidas Ltda","cnpj":"55.251.951/0001-25","endereco":"Avenida Embaixador Abelardo Bueno, 3180 Loja 112","bairro":"Curicica","cidade":"Rio de Janeiro","uf":"RJ","cep":"22775040"},"44.363.848/0001-50":{"loja":"Di Blasi Botafogo","razao":"GBB Pizzas Artesanais Ltda","cnpj":"44.363.848/0001-50","endereco":"Rua General Polidoro, 167 Loja A","bairro":"Botafogo","cidade":"Rio de Janeiro","uf":"RJ","cep":"22280002"},"43.915.096/0001-20":{"loja":"Di Blasi Tijuca","razao":"CCC Pizza Ltda","cnpj":"43.915.096/0001-20","endereco":"Rua Gonzaga Bastos, 25 Loja B","bairro":"Tijuca","cidade":"Rio de Janeiro","uf":"RJ","cep":"20541000"},"46.082.378/0001-82":{"loja":"Di Blasi Méier","razao":"Fonte Di Grano Ltda","cnpj":"46.082.378/0001-82","endereco":"Rua Piauí, 295 NA","bairro":"Méier","cidade":"Rio de Janeiro","uf":"RJ","cep":"20770130"},"46.833.428/0001-16":{"loja":"Di Blasi Flamengo","razao":"Virgem de Guadalupe Comercio de Alimentos Ltda","cnpj":"46.833.428/0001-16","endereco":"Travessa dos Tamoios, 7 Loja F","bairro":"Flamengo","cidade":"Rio de Janeiro","uf":"RJ","cep":"22230050"},"48.375.766/0001-87":{"loja":"Di Blasi Piratininga","razao":"GAP Pizzaria e Comercio Ltda","cnpj":"48.375.766/0001-87","endereco":"Avenida Doutor Raul de Oliveira Rodrigues, 266 NA","bairro":"Piratininga","cidade":"Niterói","uf":"RJ","cep":"24350630"},"49.000.900/0001-28":{"loja":"Di Blasi Campo Grande","razao":"Buena Pizzeria Campo Grande Ltda","cnpj":"49.000.900/0001-28","endereco":"Estrada da Cachamorra, 930 Loja D","bairro":"Campo Grande","cidade":"Rio de Janeiro","uf":"RJ","cep":"23040150"},"49.551.647/0001-09":{"loja":"Di Blasi Vista Alegre","razao":"JM Pizzas Artesanais Ltda","cnpj":"49.551.647/0001-09","endereco":"Avenida Padre Roser, 471 Loja C","bairro":"Vila da Penha","cidade":"Rio de Janeiro","uf":"RJ","cep":"21220560"},"49.793.729/0001-51":{"loja":"Di Blasi Ilha","razao":"Lusa Alimentos Ltda","cnpj":"49.793.729/0001-51","endereco":"Rua Colina, 60 Loja 23","bairro":"Ilha do Governador","cidade":"Rio de Janeiro","uf":"RJ","cep":"21931380"},"51.388.421/0001-72":{"loja":"Di Blasi Barra Golf","razao":"JONES FERNANDES PIZZARIA LTDA","cnpj":"51.388.421/0001-72","endereco":"Avenida das Américas, 6700 BL2 LJ107","bairro":"Barra da Tijuca","cidade":"Rio de Janeiro","uf":"RJ","cep":"22793080"},"51.813.117/0001-25":{"loja":"Di Blasi Nova Iguaçu","razao":"Felps Alimentos LTDA","cnpj":"51.813.117/0001-25","endereco":"Rua Doutor Barros Junior, 272 Loja 3 e 4","bairro":"Centro","cidade":"Nova Iguaçu","uf":"RJ","cep":"26215072"},"51.919.407/0001-58":{"loja":"Di Blasi Santana","razao":"Rodrigo Rios Pizzas Artesanais Ltda","cnpj":"51.919.407/0001-58","endereco":"Rua Francisca Julia, 43 None","bairro":"Santana","cidade":"São Paulo","uf":"SP","cep":"02403010"},"52.341.453/0001-85":{"loja":"Di Blasi Vila Valqueire","razao":"DB Comércio de Alimentos e Bebidas Ltda","cnpj":"52.341.453/0001-85","endereco":"Rua das Dalias, 69 Salas 3 e 4","bairro":"Vila Valqueire","cidade":"Rio de Janeiro","uf":"RJ","cep":"21330740"},"53.147.562/0001-29":{"loja":"Di Blasi Centro","razao":"Di Blasi Centro Restaurante Ltda","cnpj":"53.147.562/0001-29","endereco":"Rua Washington Luiz, 79 Loja A","bairro":"Centro","cidade":"Rio de Janeiro","uf":"RJ","cep":"20230026"},"52.864.990/0001-00":{"loja":"Di Blasi Taquara","razao":"AB Campos Comercio de Alimentos e Bebidas Ltda","cnpj":"52.864.990/0001-00","endereco":"Estrada Meringuava, 1310 Loja 115","bairro":"Taquara","cidade":"Rio de Janeiro","uf":"RJ","cep":"22723427"},"52.799.287/0001-65":{"loja":"Di Blasi Pontal","razao":"LCA Pizzas Comercio de Alimentos e Bebidas Ltda","cnpj":"52.799.287/0001-65","endereco":"Av das Americas, 19020 Loja A","bairro":"Recreio dos Bandeirantes","cidade":"Rio de Janeiro","uf":"RJ","cep":"22790704"},"54.206.625/0001-33":{"loja":"Di Blasi Cidade Jardim","razao":"3LA Prudente Comercio de Alimentos Ltda","cnpj":"54.206.625/0001-33","endereco":"Av Prudente de Morais, 72 Loja 1","bairro":"Cidade Jardim","cidade":"Belo Horizonte","uf":"MG","cep":"30380002"},"54.296.667/0001-02":{"loja":"Di Blasi Pendotiba","razao":"SPV Comercio e Pizzaria Ltda","cnpj":"54.296.667/0001-02","endereco":"Estrada Caetano Monteiro, 217 Loja 102","bairro":"Pendotiba","cidade":"Niterói","uf":"RJ","cep":"24325005"},"54.284.235/0001-81":{"loja":"Di Blasi Teresópolis","razao":"Teresópolis Pizzaria Ltda","cnpj":"54.284.235/0001-81","endereco":"Rua Principal, 100","bairro":"Centro","cidade":"Teresópolis","uf":"RJ","cep":"25950000"},"54.871.676/0001-80":{"loja":"Di Blasi São Gonçalo","razao":"São Gonçalo Alimentos Ltda","cnpj":"54.871.676/0001-80","endereco":"Av Principal, 200","bairro":"Centro","cidade":"São Gonçalo","uf":"RJ","cep":"24000000"},"55.314.149/0001-37":{"loja":"Di Blasi Bela Vista","razao":"Bela Vista Pizzaria Ltda","cnpj":"55.314.149/0001-37","endereco":"Rua da Bela Vista, 100","bairro":"Bela Vista","cidade":"São Paulo","uf":"SP","cep":"01300000"},"56.367.985/0001-42":{"loja":"Di Blasi Vila Velha","razao":"Vila Velha Pizzaria Ltda","cnpj":"56.367.985/0001-42","endereco":"Av Principal, 300","bairro":"Centro","cidade":"Vila Velha","uf":"ES","cep":"29100000"},"57.496.417/0001-04":{"loja":"Di Blasi Canoas","razao":"Canoas Pizzaria Ltda","cnpj":"57.496.417/0001-04","endereco":"Rua Principal, 100","bairro":"Centro","cidade":"Canoas","uf":"RS","cep":"92000000"},"58.288.710/0001-49":{"loja":"Di Blasi Copacabana","razao":"Copacabana Pizzaria Ltda","cnpj":"58.288.710/0001-49","endereco":"Av Atlântica, 100","bairro":"Copacabana","cidade":"Rio de Janeiro","uf":"RJ","cep":"22010000"},"59.765.759/0001-08":{"loja":"Di Blasi Caxias","razao":"Caxias Pizzaria Ltda","cnpj":"59.765.759/0001-08","endereco":"Av Kennedy, 100","bairro":"Centro","cidade":"Duque de Caxias","uf":"RJ","cep":"25000000"},"59.937.856/0001-30":{"loja":"Di Blasi S.J.Rio Preto","razao":"S.J.Rio Preto Pizzaria Ltda","cnpj":"59.937.856/0001-30","endereco":"Av Bady Bassitt, 100","bairro":"Centro","cidade":"São José do Rio Preto","uf":"SP","cep":"15000000"},"59.966.627/0001-44":{"loja":"Di Blasi Aflitos","razao":"JT COMERCIO DE ALIMENTOS LTDA","cnpj":"59.966.627/0001-44","endereco":"Rua Carneiro Vilela, 666","bairro":"Aflitos","cidade":"Recife","uf":"PE","cep":"52050033"},"60.099.051/0001-44":{"loja":"Di Blasi Florianópolis","razao":"Florianópolis Pizzaria Ltda","cnpj":"60.099.051/0001-44","endereco":"Av Hercílio Luz, 100","bairro":"Centro","cidade":"Florianópolis","uf":"SC","cep":"88000000"},"60.135.622/0001-59":{"loja":"Di Blasi Cabo Frio","razao":"Cabo Frio Pizzaria Ltda","cnpj":"60.135.622/0001-59","endereco":"Rua dos Magnatas, 100","bairro":"Centro","cidade":"Cabo Frio","uf":"RJ","cep":"28900000"},"60.221.100/0001-70":{"loja":"Di Blasi Volta Redonda","razao":"Volta Redonda Pizzaria Ltda","cnpj":"60.221.100/0001-70","endereco":"Av Amaral Peixoto, 100","bairro":"Centro","cidade":"Volta Redonda","uf":"RJ","cep":"27200000"},"60.532.771/0001-51":{"loja":"Di Blasi Fonseca","razao":"Fonseca Pizzaria Ltda","cnpj":"60.532.771/0001-51","endereco":"Rua Coronel Moreira César, 100","bairro":"Fonseca","cidade":"Niterói","uf":"RJ","cep":"24100000"},"60.750.616/0001-01":{"loja":"Di Blasi João Pessoa","razao":"João Pessoa Pizzaria Ltda","cnpj":"60.750.616/0001-01","endereco":"Av Epitácio Pessoa, 100","bairro":"Centro","cidade":"João Pessoa","uf":"PB","cep":"58000000"},"60.960.250/0001-03":{"loja":"Di Blasi Maceió","razao":"Maceió Pizzaria Ltda","cnpj":"60.960.250/0001-03","endereco":"Av Comendador Gustavo Paiva, 100","bairro":"Centro","cidade":"Maceió","uf":"AL","cep":"57000000"},"61.077.232/0001-32":{"loja":"Di Blasi Renascença","razao":"Renascença Pizzaria Ltda","cnpj":"61.077.232/0001-32","endereco":"Rua dos Açougues, 100","bairro":"Renascença","cidade":"São Luís","uf":"MA","cep":"65000000"},"61.287.873/0001-11":{"loja":"Di Blasi Grajaú","razao":"Grajaú Pizzaria Ltda","cnpj":"61.287.873/0001-11","endereco":"Rua Boa Vista, 100","bairro":"Grajaú","cidade":"Rio de Janeiro","uf":"RJ","cep":"20500000"},"62.269.663/0001-63":{"loja":"Di Blasi Batel","razao":"Batel Pizzaria Ltda","cnpj":"62.269.663/0001-63","endereco":"Rua Comendador Araújo, 100","bairro":"Batel","cidade":"Curitiba","uf":"PR","cep":"80420000"},"62.399.347/0001-06":{"loja":"Di Blasi Manaus","razao":"Manaus Pizzaria Ltda","cnpj":"62.399.347/0001-06","endereco":"Av Eduardo Ribeiro, 100","bairro":"Centro","cidade":"Manaus","uf":"AM","cep":"69000000"},"63.573.054/0001-66":{"loja":"Di Blasi Maricá","razao":"Maricá Pizzaria Ltda","cnpj":"63.573.054/0001-66","endereco":"Av Roberto Silveira, 100","bairro":"Centro","cidade":"Maricá","uf":"RJ","cep":"24900000"},"49.421.020/0001-25":{"loja":"Di Blasi Parauapebas","razao":"Parauapebas Pizzaria Ltda","cnpj":"49.421.020/0001-25","endereco":"Rua A, 100","bairro":"Centro","cidade":"Parauapebas","uf":"PA","cep":"68500000"}};

/* ═══════════════════════════════════════════════════════════════════════
   MAPEAMENTO  Nome-Unidade (como vem no Excel do cliente) → CNPJ
   Fonte: Boleto_Março_Rascunho.xlsx  (col A → col B)
═══════════════════════════════════════════════════════════════════════ */
const MAPA_UNIDADE = {"Barra (RJ)":"28.021.953/0001-55","Recreio (RJ)":"38.064.672/0001-33","Freguesia (RJ)":"41.216.909/0001-69","Leblon (RJ)":"43.444.183/0001-47","Icaraí (RJ)":"43.577.150/0001-75","Tijuca (RJ)":"43.915.096/0001-20","Botafogo (RJ)":"44.363.848/0001-50","Rio 2 (RJ)":"55.251.951/0001-25","Méier (RJ)":"46.082.378/0001-82","Flamengo (RJ)":"46.833.428/0001-16","Piratininga (RJ)":"48.375.766/0001-87","Campo Grande (RJ)":"49.000.900/0001-28","Vista Alegre (RJ)":"49.551.647/0001-09","Ilha (RJ)":"49.793.729/0001-51","Barra Golf (RJ)":"51.388.421/0001-72","Nova Iguaçú (RJ)":"51.813.117/0001-25","Vila Valqueire (RJ)":"52.341.453/0001-85","Santana (SP)":"51.919.407/0001-58","Taquara (RJ)":"52.864.990/0001-00","Pontal (RJ)":"52.799.287/0001-65","Centro (RJ)":"53.147.562/0001-29","São Gonçalo (RJ)":"54.871.676/0001-80","Pendotiba (RJ)":"54.296.667/0001-02","Cidade Jardim (MG)":"54.206.625/0001-33","Teresópolis (RJ)":"54.284.235/0001-81","Bela Vista (SP)":"55.314.149/0001-37","Vila Velha (ES)":"56.367.985/0001-42","Copacabana (RJ)":"58.288.710/0001-49","Canoas (RS)":"57.496.417/0001-04","Caxias (RJ)":"59.765.759/0001-08","Fonseca (RJ)":"60.532.771/0001-51","Cabo Frio (RJ)":"60.135.622/0001-59","Volta Redonda (RJ)":"60.221.100/0001-70","Aflitos (PE)":"59.966.627/0001-44","São José do Rio Preo (SP)":"59.937.856/0001-30","São José do Rio Preto (SP)":"59.937.856/0001-30","Florianópolis (SC)":"60.099.051/0001-44","Parauapebas (PA)":"49.421.020/0001-25","João Pessoa (PB)":"60.750.616/0001-01","Maceió (AL)":"60.960.250/0001-03","Renascença (MA)":"61.077.232/0001-32","Maricá (RJ)":"63.573.054/0001-66","Manaus (AM)":"62.399.347/0001-06","Batel (PR)":"62.269.663/0001-63","Grajau (RJ)":"61.287.873/0001-11"};

const MESES = ["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"];

/* ═══════════════════════════════════════════════════════════════════════
   GERADOR CNAB 400 — Banco do Brasil
═══════════════════════════════════════════════════════════════════════ */
const pN  = (v,n) => String(v??0).replace(/\D/g,"").padStart(n,"0").slice(0,n);
const pA  = (v,n) => { let s=String(v??"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/Ç/g,"C"); return s.padEnd(n," ").slice(0,n); };
const pD  = (v,n) => String(v??"").toUpperCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"").padStart(n," ").slice(0,n);
const fDt = v => { const m=String(v??"").match(/(\d{2})\/(\d{2})\/(\d{4})/); return m?`${m[1]}${m[2]}${m[3].slice(2)}`:"000000"; };
const fVl = (v,n=13) => String(Math.round((parseFloat(String(v??"0").replace(",","."))||0)*100)).padStart(n,"0").slice(0,n);
const dm10 = s => { let sm=0,m=2; for(let i=s.length-1;i>=0;i--){const r=parseInt(s[i])*m;sm+=Math.floor(r/10)+r%10;m=m===2?3:2;} return String((10-sm%10)%10); };
const dvNN = (c7,n10) => dm10(String(c7).padStart(7,"0")+String(n10).padStart(10,"0"));

function gerarCNAB400(boletos, cfg) {
  const linhas = [];

  // HEADER
  let h="01";
  h+=pN(cfg.agencia,4); h+=pA(cfg.dvAgencia||"0",1); h+=pN(cfg.cedente,9); h+=pA(cfg.dvCedente||"0",1);
  h+=pN(cfg.carteira||"17",3); h+=pN(cfg.variacao||"019",3); h+="000000";
  h+=pA(cfg.nomeEmpresa,45); h+=" ".repeat(10); h+="00"; h+=" ".repeat(60);
  h+="0".repeat(8); h+=" ".repeat(20); h+=pN(cfg.sequencial||1,7); h+=" "; h+="    ";
  h+=pA("REMESSA",8); h+="   "; h+=" ".repeat(38); h+=" ".repeat(5);
  h+=pN(cfg.convenio,7); h+="   "; h+=" ".repeat(143); h+=pN(1,7);
  linhas.push(h);

  // DETALHES
  boletos.forEach((b,i) => {
    const seq=i+1;
    const c7=String(cfg.convenio).padStart(7,"0");
    const cart=pN(cfg.carteira||"17",2), var3=pN(cfg.variacao||"019",3);
    const nn=pN(b.nossoNum,10), dv=dvNN(c7,nn);
    const rawCnpj=String(b.cnpj||"").replace(/\D/g,"");
    const cpf=pN(rawCnpj,14), tp=rawCnpj.length>11?"02":"01";
    const nrDoc=pD(b.nrDoc||String(seq),10);
    const hoje=new Date();
    const hj=`${String(hoje.getDate()).padStart(2,"0")}/${String(hoje.getMonth()+1).padStart(2,"0")}/${hoje.getFullYear()}`;

    let d="";
    d+=pN(cfg.agencia,4); d+=pA(cfg.dvAgencia||"0",1); d+=pN(cfg.cedente,9); d+=pA(cfg.dvCedente||"0",1);
    d+=cart; d+=var3; d+="0".repeat(5); d+=c7; d+=nn; d+=dv;
    d+="0".repeat(3); d+="  "; d+="0".repeat(13); d+=" ";
    d+=nrDoc;
    d+=fDt(b.vencimento);
    d+=fVl(b.valor,13);
    d+="001"; d+="0".repeat(5); d+=pA(cfg.dvAgencia||"0",1); d+=cart;
    d+=pN(b.especie||12,2); d+="N";
    d+=fDt(hj);
    d+=pN(b.instr1||0,2); d+=pN(b.instr2||0,2);
    d+=fVl(b.moraDia||0,13); d+="000000";
    d+=fVl(b.desconto||0,13); d+=fVl(b.iof||0,13); d+=fVl(b.abatimento||0,13);
    d+=tp; d+=cpf;
    d+=pA(b.nomeSacado||"",30); d+=" ".repeat(10);
    d+=pA((b.endereco||"")+(" "+(b.bairro||"")).trim(),40); d+="0".repeat(8);
    d+=pA("",60);
    d+=pN(b.diasProtesto||0,2); d+="09"; d+="00"; d+=" ".repeat(51);
    d+=pN(seq+1,6);
    linhas.push((d+" ".repeat(400)).slice(0,394)+pN(seq+1,6));
  });

  // TRAILER
  linhas.push("9"+" ".repeat(393)+pN(boletos.length+2,6));
  return linhas.join("\r\n")+"\r\n";
}

/* ═══════════════════════════════════════════════════════════════════════
   HELPERS
═══════════════════════════════════════════════════════════════════════ */
const moeda = v => new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(parseFloat(v)||0);
const hoje  = new Date();
const hoje_str = `${String(hoje.getDate()).padStart(2,"0")}/${String(hoje.getMonth()+1).padStart(2,"0")}/${hoje.getFullYear()}`;

function downloadBlob(content, filename, type="text/plain;charset=ascii") {
  const a=document.createElement("a");
  a.href=URL.createObjectURL(new Blob([content],{type}));
  a.download=filename; a.click(); URL.revokeObjectURL(a.href);
}

/* ═══════════════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════════════ */
export default function App() {
  const [tela, setTela]       = useState("home");   // home | modal | lista | done
  const [boletos, setBoletos] = useState([]);
  const [mes, setMes]         = useState("");
  const [ano, setAno]         = useState(String(hoje.getFullYear()));
  const [venc, setVenc]       = useState("");
  const [nrIni, setNrIni]     = useState("2135");   // próximo após 2134 (último no rascunho)
  const [arquivo, setArquivo] = useState(null);
  const [nomeArq, setNomeArq] = useState("");
  const [drag, setDrag]       = useState(false);
  const [erro, setErro]       = useState("");
  const [filtro, setFiltro]   = useState("todos");  // todos|sim|nao
  const [cfg, setCfg]         = useState({
    nomeEmpresa: "DI BLASI FRANCHISING LTDA",
    cnpj:        "41720736000111",
    agencia:     "1253",
    dvAgencia:   "X",
    cedente:     "041953",
    dvCedente:   "2",
    convenio:    "3453604",
    carteira:    "17",
    variacao:    "019",
    sequencial:  "1",
  });
  const fileRef = useRef();

  /* ── Importar planilha ── */
  const importar = useCallback((file, mesIdx, vencimento, nrInicial) => {
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const wb = XLSX.read(e.target.result, {type:"array"});
        const royNm = wb.SheetNames.find(n=>n.toLowerCase().includes("royal"));
        const mktNm = wb.SheetNames.find(n=>n.toLowerCase().includes("market"));
        if(!royNm||!mktNm) { setErro("Abas 'Royalties' e 'Marketing' não encontradas no arquivo."); return; }

        const royRows = XLSX.utils.sheet_to_json(wb.Sheets[royNm],{header:1,defval:null});
        const mktRows = XLSX.utils.sheet_to_json(wb.Sheets[mktNm],{header:1,defval:null});

        // linha índice 1 = cabeçalho: [null, 'Unidades', 'Janeiro', 'Fevereiro', ...]
        const header = royRows[1] || [];
        const meNome = MESES[mesIdx];
        let colIdx   = -1;
        for(let c=2;c<header.length;c++){
          const h = String(header[c]||"").trim();
          if(h.toLowerCase().startsWith(meNome.toLowerCase().slice(0,3))) { colIdx=c; break; }
        }
        if(colIdx<0){ setErro(`Mês "${meNome}" não encontrado nas colunas. Verifique o arquivo.`); return; }

        let nr = parseInt(nrInicial)||1;
        const lista = [];

        for(let r=2; r<royRows.length; r++){
          const rowR=royRows[r], rowM=mktRows[r];
          if(!rowR||!rowR[1]) continue;
          const unidade = String(rowR[1]).trim();
          const valR    = parseFloat(rowR[colIdx])||0;
          const valM    = rowM ? parseFloat(rowM[colIdx])||0 : 0;
          const cnpj    = MAPA_UNIDADE[unidade]||"";
          const fran    = FRANQUEADOS[cnpj]||null;

          // boleto ROYALTIES
          lista.push({
            id:`${r}R`, unidade, tipo:"R",
            cnpj, nomeSacado: fran?.razao||unidade,
            endereco: fran?.endereco||"", bairro: fran?.bairro||"",
            valor: valR, nrDoc:`${nr}R`, nossoNum: nr,
            vencimento: vencimento, entraCnab: valR>0,
            loja: fran?.loja||unidade, semCadastro:!fran,
          });
          nr++;

          // boleto MARKETING
          lista.push({
            id:`${r}M`, unidade, tipo:"M",
            cnpj, nomeSacado: fran?.razao||unidade,
            endereco: fran?.endereco||"", bairro: fran?.bairro||"",
            valor: valM, nrDoc:`${nr}M`, nossoNum: nr,
            vencimento: vencimento, entraCnab: valM>0,
            loja: fran?.loja||unidade, semCadastro:!fran,
          });
          nr++;
        }

        setBoletos(lista);
        setErro("");
        setTela("lista");
      } catch(ex){ setErro("Erro ao processar arquivo: "+ex.message); }
    };
    reader.readAsArrayBuffer(file);
  },[]);

  const confirmar = () => {
    if(!mes)                           { setErro("Selecione o mês."); return; }
    if(!venc.match(/\d{2}\/\d{2}\/\d{4}/)) { setErro("Vencimento inválido. Use DD/MM/AAAA."); return; }
    if(!arquivo)                        { setErro("Nenhum arquivo selecionado."); return; }
    setErro("");
    importar(arquivo, MESES.indexOf(mes), venc, nrIni);
  };

  const toggle = id => setBoletos(p=>p.map(b=>b.id===id?{...b,entraCnab:!b.entraCnab}:b));
  const upd    = (id,k,v) => setBoletos(p=>p.map(b=>b.id===id?{...b,[k]:v}:b));

  const selecionados = boletos.filter(b=>b.entraCnab);
  const visíveis     = filtro==="todos"?boletos : filtro==="sim"?selecionados : boletos.filter(b=>!b.entraCnab);
  const semCad       = [...new Set(boletos.filter(b=>b.semCadastro).map(b=>b.unidade))];
  const totalR = selecionados.filter(b=>b.tipo==="R").reduce((s,b)=>s+(parseFloat(b.valor)||0),0);
  const totalM = selecionados.filter(b=>b.tipo==="M").reduce((s,b)=>s+(parseFloat(b.valor)||0),0);

  const gerar = () => {
    const cnab = gerarCNAB400(selecionados, cfg);
    downloadBlob(cnab, `REMESSA_${hoje_str.replace(/\//g,"")}.rem`);

    // Exportar Excel de controle no mesmo formato do rascunho
    const rows = [
      ["Unidades","CNPJ","N° Royalties","Royalties","N° Marketing","Marketing","Entra CNAB"],
    ];
    // Agrupar por unidade
    const porUnidade = {};
    selecionados.forEach(b=>{
      if(!porUnidade[b.unidade]) porUnidade[b.unidade]={};
      porUnidade[b.unidade][b.tipo]=b;
    });
    for(const [unidade, tipos] of Object.entries(porUnidade)){
      const r=tipos.R, m=tipos.M;
      rows.push([
        unidade, r?.cnpj||m?.cnpj||"",
        r?.nrDoc||"", r?.valor||0,
        m?.nrDoc||"", m?.valor||0,
        "SIM"
      ]);
    }
    const xwb=XLSX.utils.book_new();
    const xws=XLSX.utils.aoa_to_sheet(rows);
    xws["!cols"]=[{wch:26},{wch:22},{wch:13},{wch:16},{wch:13},{wch:16},{wch:13}];
    XLSX.utils.book_append_sheet(xwb,xws,"Boletos");
    XLSX.writeFile(xwb,`Boletos_${mes}_${ano}.xlsx`);

    setTela("done");
  };

  /* ──────────────────────── DESIGN SYSTEM ──────────────────────── */
  const C = {
    bg:"#0c0e14", card:"#12151f", border:"#1e2433", borderLight:"#252d3d",
    accent:"#e8832a", accentGlow:"rgba(232,131,42,.15)",
    blue:"#3b82f6", blueGlow:"rgba(59,130,246,.12)",
    txt:"#dde3f0", muted:"#6b7898", dim:"#1a2035",
    green:"#10b981", red:"#ef4444",
    roy:"#8b5cf6", mkt:"#06b6d4",
    royBg:"rgba(139,92,246,.12)", mktBg:"rgba(6,182,212,.12)",
  };

  /* Estilos base */
  const S = {
    app: { minHeight:"100vh", background:C.bg, color:C.txt,
           fontFamily:"'IBM Plex Sans','Segoe UI',sans-serif",
           backgroundImage:"radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,131,42,.08), transparent)" },

    nav: { background:C.card, borderBottom:`1px solid ${C.border}`,
           padding:"0 28px", height:56,
           display:"flex", alignItems:"center", gap:12,
           position:"sticky", top:0, zIndex:90,
           backdropFilter:"blur(12px)" },
    navLogo: { width:32, height:32, background:`linear-gradient(135deg,${C.accent},#d06020)`,
               borderRadius:8, display:"flex", alignItems:"center", justifyContent:"center",
               fontSize:16, flexShrink:0 },
    navTitle:{ fontSize:15, fontWeight:700, color:C.txt, letterSpacing:"-.3px" },
    navSub:  { fontSize:11, color:C.muted },

    main: { maxWidth:1140, margin:"0 auto", padding:"32px 20px" },

    h1: { fontSize:26, fontWeight:800, color:C.txt, letterSpacing:"-.5px", marginBottom:4 },
    h2: { fontSize:15, fontWeight:700, color:C.txt, marginBottom:6 },
    p:  { fontSize:13, color:C.muted, lineHeight:1.65 },

    card: { background:C.card, border:`1px solid ${C.border}`,
            borderRadius:14, padding:24, marginBottom:16 },

    /* ─ Drop zone ─ */
    drop: (active) => ({
      border:`2px dashed ${active?C.accent:C.border}`,
      borderRadius:12, padding:"52px 28px", textAlign:"center",
      cursor:"pointer", transition:"all .15s",
      background: active?C.accentGlow:"transparent",
    }),

    /* ─ Botões ─ */
    btnPrimary: {
      background:`linear-gradient(135deg,${C.accent},#d06020)`,
      color:"#fff", border:"none", borderRadius:9, padding:"11px 26px",
      fontWeight:700, fontSize:13, cursor:"pointer", fontFamily:"inherit",
      boxShadow:`0 4px 20px ${C.accentGlow}`, letterSpacing:".1px",
      display:"flex", alignItems:"center", gap:8,
    },
    btnSecondary: {
      background:"transparent", color:C.blue,
      border:`1px solid ${C.blue}`, borderRadius:9,
      padding:"10px 22px", fontWeight:600, fontSize:13,
      cursor:"pointer", fontFamily:"inherit",
    },
    btnGhost: {
      background:"transparent", color:C.muted,
      border:`1px solid ${C.border}`, borderRadius:8,
      padding:"8px 16px", fontSize:12, cursor:"pointer", fontFamily:"inherit",
    },

    /* ─ Inputs ─ */
    input: {
      background:C.dim, border:`1px solid ${C.border}`,
      borderRadius:8, color:C.txt, padding:"9px 12px",
      fontSize:13, fontFamily:"inherit", outline:"none", width:"100%",
    },
    select: {
      background:C.dim, border:`1px solid ${C.border}`,
      borderRadius:8, color:C.txt, padding:"9px 12px",
      fontSize:13, fontFamily:"inherit", outline:"none",
    },
    label: {
      fontSize:11, color:C.muted, marginBottom:5, display:"block",
      fontWeight:600, textTransform:"uppercase", letterSpacing:".5px",
    },

    /* ─ Modal ─ */
    overlay: {
      position:"fixed", inset:0, background:"rgba(0,0,0,.7)", zIndex:200,
      display:"flex", alignItems:"center", justifyContent:"center",
      backdropFilter:"blur(4px)",
    },
    modalBox: {
      background:C.card, border:`1px solid ${C.border}`,
      borderRadius:18, padding:36, width:500, maxWidth:"95vw",
      boxShadow:"0 24px 60px rgba(0,0,0,.6)",
    },

    /* ─ Tabela ─ */
    table:{ width:"100%", borderCollapse:"collapse" },
    th: { textAlign:"left", fontSize:10, color:C.muted, fontWeight:700, letterSpacing:".5px",
          textTransform:"uppercase", padding:"9px 10px", borderBottom:`1px solid ${C.border}` },
    td: { padding:"10px 10px", borderBottom:`1px solid ${C.dim}`, fontSize:12, verticalAlign:"middle" },

    /* ─ Badges ─ */
    badgeR: { background:C.royBg, color:"#a78bfa", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700 },
    badgeM: { background:C.mktBg, color:"#67e8f9", padding:"2px 10px", borderRadius:20, fontSize:10, fontWeight:700 },
    chipOn:  { background:"rgba(16,185,129,.12)", color:C.green, border:"1px solid rgba(16,185,129,.3)", padding:"3px 12px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", userSelect:"none" },
    chipOff: { background:"rgba(239,68,68,.08)",  color:C.red,   border:"1px solid rgba(239,68,68,.2)", padding:"3px 12px", borderRadius:20, fontSize:10, fontWeight:700, cursor:"pointer", userSelect:"none" },

    /* ─ Stat cards ─ */
    stat: { background:C.dim, border:`1px solid ${C.border}`, borderRadius:10, padding:"14px 18px", flex:1, minWidth:115 },
    statV:{ fontSize:20, fontWeight:800, color:C.txt, fontVariantNumeric:"tabular-nums" },
    statL:{ fontSize:10, color:C.muted, textTransform:"uppercase", letterSpacing:".5px", marginTop:2 },

    /* ─ Filtros ─ */
    filtrBtn: (ativo) => ({
      background: ativo?C.accent:"transparent",
      color: ativo?"#fff":C.muted,
      border:`1px solid ${ativo?C.accent:C.border}`,
      borderRadius:20, padding:"4px 16px",
      fontSize:11, fontWeight:700, cursor:"pointer", fontFamily:"inherit",
    }),
  };

  /* ══════════════════════════════════════════ TELA DONE ══════════════════ */
  if(tela==="done") return (
    <div style={S.app}>
      <nav style={S.nav}>
        <div style={S.navLogo}>🍕</div>
        <div><div style={S.navTitle}>Di Blasi · CNAB 400</div><div style={S.navSub}>Banco do Brasil</div></div>
      </nav>
      <div style={{...S.main, textAlign:"center", paddingTop:70}}>
        <div style={{fontSize:64, marginBottom:20}}>✅</div>
        <div style={{fontSize:24, fontWeight:800, color:C.txt, marginBottom:8}}>Arquivos gerados com sucesso!</div>
        <div style={{color:C.muted, fontSize:14, marginBottom:4}}>
          <strong style={{color:C.txt}}>{selecionados.length} boletos</strong> · Total {moeda(totalR+totalM)}
        </div>
        <div style={{color:C.muted, fontSize:12, marginBottom:36}}>
          📄 REMESSA_{hoje_str.replace(/\//g,"")}.rem &nbsp;·&nbsp; 📊 Boletos_{mes}_{ano}.xlsx
        </div>
        <div style={{display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap"}}>
          <button style={S.btnPrimary} onClick={()=>setTela("lista")}>← Voltar e revisar</button>
          <button style={S.btnSecondary} onClick={()=>{setTela("home");setBoletos([]);setArquivo(null);setNomeArq("");}}>
            Nova importação
          </button>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════ TELA LISTA ═══════════════════ */
  if(tela==="lista") return (
    <div style={S.app}>
      <nav style={S.nav}>
        <div style={S.navLogo}>🍕</div>
        <div>
          <div style={S.navTitle}>Di Blasi · CNAB 400</div>
          <div style={S.navSub}>{mes} {ano} · {nomeArq}</div>
        </div>
        <div style={{marginLeft:"auto", display:"flex", gap:10, alignItems:"center"}}>
          <button style={S.btnGhost} onClick={()=>{setTela("home");setBoletos([]);setArquivo(null);setNomeArq("");}}>
            ← Nova importação
          </button>
          <button style={S.btnPrimary} onClick={gerar}>
            ⬇ Gerar CNAB ({selecionados.length})
          </button>
        </div>
      </nav>

      <div style={S.main}>

        {/* STATS */}
        <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap"}}>
          {[
            ["Importados",boletos.length],
            ["Entram no CNAB",selecionados.length],
            ["Total Royalties",moeda(totalR)],
            ["Total Marketing",moeda(totalM)],
            ["Total Geral",moeda(totalR+totalM)],
          ].map(([l,v])=>(
            <div key={l} style={S.stat}>
              <div style={S.statV}>{v}</div>
              <div style={S.statL}>{l}</div>
            </div>
          ))}
        </div>

        {/* ALERTA sem cadastro */}
        {semCad.length>0 && (
          <div style={{...S.card, border:"1px solid rgba(232,131,42,.4)", background:"rgba(232,131,42,.05)", padding:"14px 18px"}}>
            <span style={{fontSize:12, color:C.accent, fontWeight:700}}>⚠ {semCad.length} unidade(s) sem cadastro na base: </span>
            <span style={{fontSize:11, color:C.muted}}>{semCad.join(" · ")}</span>
            <div style={{fontSize:11, color:C.muted, marginTop:3}}>Boletos incluídos sem endereço. Preencha manualmente ou atualize a base.</div>
          </div>
        )}

        {/* FILTROS */}
        <div style={{...S.card, display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", padding:"12px 18px"}}>
          <span style={{fontSize:11, color:C.muted, textTransform:"uppercase", letterSpacing:".4px", marginRight:4}}>Exibir:</span>
          {[["todos",`Todos (${boletos.length})`],["sim",`Entra CNAB (${selecionados.length})`],["nao",`Fora (${boletos.length-selecionados.length})`]].map(([k,l])=>(
            <button key={k} style={S.filtrBtn(filtro===k)} onClick={()=>setFiltro(k)}>{l}</button>
          ))}
          <span style={{marginLeft:"auto", fontSize:11, color:C.muted}}>
            Clique <span style={{color:C.green}}>SIM</span>/<span style={{color:C.red}}>NÃO</span> para incluir/excluir · edite Nr.Doc e Nosso Nº diretamente
          </span>
        </div>

        {/* TABELA */}
        <div style={{...S.card, padding:0, overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={S.table}>
              <thead>
                <tr style={{background:C.dim}}>
                  {["Unidade / Loja","Tipo","CNPJ Sacado","Valor","Nr. Documento","Nosso Nº","Vencimento","Entra CNAB"].map(h=>(
                    <th key={h} style={S.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visíveis.map(b=>(
                  <tr key={b.id} style={{opacity:b.entraCnab?1:.38, background:b.semCadastro?"rgba(232,131,42,.025)":"transparent"}}>
                    <td style={S.td}>
                      <div style={{fontWeight:700, color:C.txt, fontSize:12}}>{b.loja}</div>
                      <div style={{color:C.muted, fontSize:10}}>{b.unidade}</div>
                      {b.semCadastro&&<div style={{color:C.accent, fontSize:9, fontWeight:700, marginTop:1}}>⚠ SEM CADASTRO</div>}
                    </td>
                    <td style={S.td}><span style={b.tipo==="R"?S.badgeR:S.badgeM}>{b.tipo==="R"?"ROYALTIES":"MARKETING"}</span></td>
                    <td style={S.td}><span style={{fontSize:11, fontFamily:"monospace", color:b.cnpj?C.muted:"#f87171"}}>{b.cnpj||"—"}</span></td>
                    <td style={S.td}><span style={{fontWeight:700, color:(parseFloat(b.valor)||0)>0?C.green:C.red}}>{moeda(b.valor)}</span></td>
                    <td style={S.td}>
                      <input style={{...S.input, width:82, fontFamily:"monospace", fontSize:12, padding:"5px 8px"}}
                        value={b.nrDoc} onChange={e=>upd(b.id,"nrDoc",e.target.value.toUpperCase())}/>
                    </td>
                    <td style={S.td}>
                      <input style={{...S.input, width:66, fontFamily:"monospace", fontSize:12, padding:"5px 8px"}}
                        value={b.nossoNum} onChange={e=>upd(b.id,"nossoNum",e.target.value)}/>
                    </td>
                    <td style={S.td}>
                      <input style={{...S.input, width:94, fontSize:12, padding:"5px 8px"}}
                        value={b.vencimento} onChange={e=>upd(b.id,"vencimento",e.target.value)}/>
                    </td>
                    <td style={S.td}>
                      <button style={b.entraCnab?S.chipOn:S.chipOff} onClick={()=>toggle(b.id)}>
                        {b.entraCnab?"SIM":"NÃO"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div style={{display:"flex", gap:10, marginTop:16}}>
          <button style={S.btnPrimary} onClick={gerar}>
            ⬇ Gerar CNAB 400 + Excel de controle
          </button>
        </div>
      </div>
    </div>
  );

  /* ════════════════════════════════════════ TELA HOME ════════════════════ */
  return (
    <div style={S.app}>
      <nav style={S.nav}>
        <div style={S.navLogo}>🍕</div>
        <div>
          <div style={S.navTitle}>Di Blasi Franchising · Gerador CNAB 400</div>
          <div style={S.navSub}>Banco do Brasil · Cobrança Integrada · 47 franqueados pré-cadastrados</div>
        </div>
      </nav>

      <div style={S.main}>
        <div style={{marginBottom:28}}>
          <div style={S.h1}>Gerador de Remessa CNAB 400</div>
          <div style={S.p}>
            Importe a planilha de faturamento do cliente → o sistema cruza com a base de franqueados →
            revise os boletos → gere o arquivo <code style={{color:C.accent}}>.rem</code> pronto para enviar ao BB.
          </div>
        </div>

        {/* DROP ZONE */}
        <div style={S.card}>
          <div style={S.h2}>1. Importar planilha de faturamento do cliente</div>
          <div style={{...S.p, marginBottom:16}}>
            Arquivo <strong>.xlsx</strong> com abas{" "}
            <code style={{color:C.blue}}>Royalties (4%)</code> e{" "}
            <code style={{color:C.blue}}>Marketing (2%)</code>
          </div>
          <div
            style={S.drop(drag)}
            onDragOver={e=>{e.preventDefault();setDrag(true);}}
            onDragLeave={()=>setDrag(false)}
            onDrop={e=>{e.preventDefault();setDrag(false);const f=e.dataTransfer.files[0];if(f){setNomeArq(f.name);setArquivo(f);}}}
            onClick={()=>fileRef.current?.click()}
          >
            <div style={{fontSize:38, marginBottom:10}}>📂</div>
            {nomeArq
              ? <><div style={{color:C.green, fontWeight:700, fontSize:13}}>✓ {nomeArq}</div><div style={{color:C.muted, fontSize:11, marginTop:3}}>Clique para trocar</div></>
              : <><div style={{fontWeight:600, color:C.txt, fontSize:13}}>Arraste ou clique para selecionar</div><div style={{color:C.muted, fontSize:12, marginTop:3}}>Faturamento Franquias .xlsx</div></>
            }
            <input ref={fileRef} type="file" accept=".xlsx,.xls" style={{display:"none"}}
              onChange={e=>{if(e.target.files[0]){setNomeArq(e.target.files[0].name);setArquivo(e.target.files[0]);}}}/>
          </div>
          {nomeArq && (
            <button style={{...S.btnPrimary, marginTop:16}} onClick={()=>setTela("modal")}>
              Configurar importação →
            </button>
          )}
        </div>

        {/* CONFIG CONVÊNIO */}
        <div style={S.card}>
          <div style={S.h2}>⚙ Configurações do Convênio Banco do Brasil</div>
          <div style={{...S.p, marginBottom:16}}>
            Pré-configurado com dados da <strong>Di Blasi Franchising</strong> · altere se necessário
          </div>
          <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(190px,1fr))", gap:12}}>
            {[
              ["nomeEmpresa","Nome da Empresa"],["agencia","Agência"],["dvAgencia","DV Agência"],
              ["cedente","Código Cedente"],["dvCedente","DV Cedente"],["convenio","Convênio (7 dígitos)"],
              ["carteira","Carteira"],["variacao","Variação"],["sequencial","Seq. Remessa"],
            ].map(([k,l])=>(
              <div key={k}>
                <label style={S.label}>{l}</label>
                <input style={S.input} value={cfg[k]} onChange={e=>setCfg(p=>({...p,[k]:e.target.value}))}/>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── MODAL: mês + vencimento ── */}
      {tela==="modal" && (
        <div style={S.overlay} onClick={e=>{if(e.target===e.currentTarget)setTela("home");}}>
          <div style={S.modalBox}>
            <div style={{fontSize:20, fontWeight:800, color:C.txt, marginBottom:4}}>
              📅 Configurar importação
            </div>
            <div style={{fontSize:12, color:C.muted, marginBottom:24}}>
              Arquivo: <span style={{color:C.accent, fontWeight:600}}>{nomeArq}</span>
            </div>

            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:14, marginBottom:16}}>
              <div>
                <label style={S.label}>Mês de referência *</label>
                <select style={{...S.select, width:"100%"}} value={mes} onChange={e=>setMes(e.target.value)}>
                  <option value="">Selecione...</option>
                  {MESES.map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
              <div>
                <label style={S.label}>Ano</label>
                <input style={S.input} value={ano} onChange={e=>setAno(e.target.value)} placeholder="2026"/>
              </div>
            </div>

            <div style={{marginBottom:14}}>
              <label style={S.label}>Data de Vencimento dos Boletos *</label>
              <input style={S.input} value={venc} onChange={e=>setVenc(e.target.value)}
                placeholder="DD/MM/AAAA" maxLength={10}/>
              <div style={{fontSize:10, color:C.muted, marginTop:3}}>Exemplo: 10/04/2026</div>
            </div>

            <div style={{marginBottom:22}}>
              <label style={S.label}>Número sequencial inicial dos documentos</label>
              <input style={S.input} value={nrIni} onChange={e=>setNrIni(e.target.value)} placeholder="2135"/>
              <div style={{fontSize:10, color:C.muted, marginTop:3}}>
                Royalties: <strong style={{color:C.txt}}>{nrIni}R</strong>, {parseInt(nrIni)+2}R...
                &nbsp;·&nbsp; Marketing: <strong style={{color:C.txt}}>{parseInt(nrIni)+1}M</strong>, {parseInt(nrIni)+3}M...
              </div>
            </div>

            {erro && (
              <div style={{background:"rgba(239,68,68,.08)", border:"1px solid rgba(239,68,68,.25)",
                           borderRadius:8, padding:"10px 14px", color:"#f87171", fontSize:12, marginBottom:14}}>
                ⚠ {erro}
              </div>
            )}

            <div style={{display:"flex", gap:10}}>
              <button style={{...S.btnPrimary, flex:1}} onClick={confirmar}>
                Importar e preencher boletos →
              </button>
              <button style={S.btnGhost} onClick={()=>{setTela("home");setErro("");}}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
