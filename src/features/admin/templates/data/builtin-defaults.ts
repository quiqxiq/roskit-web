// Built-in template content — paste literal dari @/web/template/*.txt.
// JANGAN edit manual: regenerate dengan menyalin ulang dari folder source.
// Placeholder %var% dipertahankan apa adanya untuk konsistensi dengan backend
// renderer.

export const DEFAULT_HEADER = `<!DOCTYPE html>
<html>
\t<head>
\t\t<title>Voucher</title>
\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
\t\t<meta http-equiv="pragma" content="no-cache" />
\t\t<link rel="icon" href="assets/img/favicon.png" />
        <script src="assets/js/jquery.min.js"></script>
\t\t<style>
\t\t\tbody {
\t\t\t  color: #000000;
\t\t\t  background-color: #FFFFFF;
\t\t\t  font-size: 14px;
\t\t\t  font-family:  'Helvetica', arial, sans-serif;
\t\t\t  margin: 0px;
\t\t\t  -webkit-print-color-adjust: exact;
\t\t\t}
\t\t\ttable.voucher {
\t\t\t  display: inline-block;
\t\t\t  border: 2px solid black;
\t\t\t  margin: 2px;
\t\t\t}
\t\t\t@page
\t\t\t{
\t\t\t  size: auto;
\t\t\t  margin-left: 7mm;
\t\t\t  margin-right: 3mm;
\t\t\t  margin-top: 9mm;
\t\t\t  margin-bottom: 3mm;
\t\t\t}
\t\t\t@media print
\t\t\t{
\t\t\t  table { page-break-after:auto }
\t\t\t  tr    { page-break-inside:avoid; page-break-after:auto }
\t\t\t  td    { page-break-inside:avoid; page-break-after:auto }
\t\t\t  thead { display:table-header-group }
\t\t\t  tfoot { display:table-footer-group }
\t\t\t}
\t\t\t.num {
\t\t\t  float:right;
\t\t\t  display:inline-block;
\t\t\t}

\t\t\t.rotate {
\t\t\t  max-width: 15px;
\t\t\t  white-space: nowrap;
\t\t\t  vertical-align: bottom;
\t\t\t  padding-right: 5px;
\t\t\t}

\t\t\t.rotate > div {
\t\t\t  transform: rotate(-90deg);
\t\t\t}

\t\t\t.qrcode{
\t\t\t  height:60px;
\t\t\t  width:60px;
\t\t\t}
\t\t\t.vc{
\t\t\t\twidth: 100%; 
\t\t\t\tfont-weight: bold; 
\t\t\t\tfont-size: 18px; 
\t\t\t\ttext-align: center;
\t\t\t\tdisplay:none;
\t\t\t}\t
\t\t\t.up{
\t\t\t\twidth: 100%; 
\t\t\t\tfont-weight: bold; 
\t\t\t\tfont-size: 15px; 
\t\t\t\ttext-align: left;
\t\t\t\tdisplay:none;
\t\t\t}\t\t\t
\t\t</style>
    </head>
    <body>`

export const DEFAULT_ROW = `<table class="voucher" style="width: 230px;">
\t<tbody>
\t\t<tr>
\t\t\t<td style="font-weight: bold; border-right: 2px  dashed black;" class="rotate" rowspan="4"><div><span class="price">%price%</span></div></td>
\t\t\t<td style="font-weight: bold" colspan="2">%hotspotName%</td>
\t\t\t<td rowspan="3"><div >%qrCode% </div></td>  
\t\t</tr>
\t\t<tr>
\t\t\t<td class="vc">%username%</td>
\t\t\t<td class="up">
\t\t\t\tUser: %username%
\t\t\t\t<br>
\t\t\t\tPass: %password%
\t\t\t</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td style="font-size: 10px;">
\t\t\t\t<span class="validity">%validity%</span> 
\t\t\t\t<span class="timelimit">%limitUptime%</span> 
\t\t\t\t<span>%limitBytesTotal%</span>
\t\t\t</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td colspan="3" style="font-size: 10px;">Login: http://%dnsName% <span class="num"> [%#%]</span></td>
\t\t</tr>
\t</tbody>
</table>
<script>
\tif("%username%" == "%password%"){
\t\t$(".vc").show()
\t}else if("%username%" != "%password%"){
\t\t$(".up").show()
\t}

\t// var tcolor = {
\t//   15000 : "red",
\t// }

\t// $(".price").css("color",tcolor["%price%"]);

</script>



`

export const DEFAULT_FOOTER = `
<script>
    if($(".validity")){
        nice('.validity')
    }
    if($(".timelimit")){
        nice('.timelimit')
    }

    if($(".price")){
        $(".price").html(currencyFormat(Number($(".price").html()),currency));
    }
    
    function nice(e){
        var x =  $(e).html();
\t\tvar s = "";
\t\tvar cid = ["Rp","RP","IDR"];
\t\tvar d_ = "";
\t\tvar h_ = "";
\t\tvar w_ = "";
\t\tif(Number(x.substring(0,1)) > 1){
\t\t\ts = "s"
\t\t}
\t\tconsole.log(cid.indexOf(currency)+" "+currency)
\t\tif(cid.indexOf(currency) > -1){
\t\t\td_ = "hari";
\t\t\th_ = "jam";
\t\t\tw_ = "minggu";
\t\t}else{
\t\t\td_ = "day"+s;
\t\t\th_ = "hour"+s;
\t\t\tw_ = "week"+s;
\t\t}
        if(x.substring(x.length - 1) == "d"){
            $(e).html(x.replace("d",d_));
        }else if(x.substring(x.length - 1) == "h"){
            $(e).html(x.replace("h",h_));
        }else if(x.substring(x.length - 1) == "w"){
            $(e).html(x.replace("w",w_));
        }
    }
</script>
</body>
</html>`

export const SMALL_HEADER = `<!DOCTYPE html>
<html>
\t<head>
\t\t<title>Voucher</title>
\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
\t\t<meta http-equiv="pragma" content="no-cache" />
\t\t<link rel="icon" href="assets/img/favicon.png" />
\t\t<script src="assets/js/jquery.min.js"></script>
\t\t<style>
\t\t\tbody {
\t\t\t\tcolor: #000000;
\t\t\t\tbackground-color: #FFFFFF;
\t\t\t\tfont-size: 14px;
\t\t\t\tfont-family:  'Helvetica', arial, sans-serif;
\t\t\t\tmargin: 0px;
\t\t\t\t-webkit-print-color-adjust: exact;
\t\t\t}
\t\t\ttable.voucher {
\t\t\t\tdisplay: inline-block;
\t\t\t\tborder: 2px solid black;
\t\t\t\tmargin: 2px;
\t\t\t}
\t\t\t@page
\t\t\t{
\t\t\t\tsize: auto;
\t\t\t\tmargin-left: 7mm;
\t\t\t\tmargin-right: 3mm;
\t\t\t\tmargin-top: 9mm;
\t\t\t\tmargin-bottom: 3mm;
\t\t\t}
\t\t\t@media print
\t\t\t{
\t\t\t\ttable { page-break-after:auto }
\t\t\t\ttr    { page-break-inside:avoid; page-break-after:auto }
\t\t\t\ttd    { page-break-inside:avoid; page-break-after:auto }
\t\t\t\tthead { display:table-header-group }
\t\t\t\ttfoot { display:table-footer-group }
\t\t\t}
\t\t\t.num {
\t\t\t\tfloat:right;
\t\t\t\tdisplay:inline-block;
\t\t\t}

\t\t</style>
\t</head>
\t<body>`

export const SMALL_ROW = `<table class="voucher" style=" width: 140px;">
\t<thead>
\t\t<tr>
\t\t\t<th colspan="2" style="width:100%;text-align: left; font-size: 12px; font-weight:bold; border-bottom: 1px black solid;">%hotspotName%<span class="num">%#%</span>
\t\t\t</th>
\t\t</tr>
\t</thead>
\t<tbody>
\t\t<tr style="color: black; font-size: 10px; text-align: center;">
\t\t\t<td class="vc" style="display:none; width: 160px;">Voucher &nbsp;</td>
\t\t\t<td class="up" style="display:none; width: 80px;">Username</td>
\t\t\t<td class="up" style="display:none; width: 80px;">Password</td>
\t\t</tr>
\t\t<tr style="color: black; font-size: 12px; text-align: center;">
\t\t\t<td style="border: 1px solid black; font-weight:bold;">%username%</td>
\t\t\t<td class="up" style="border: 1px solid black; font-weight:bold;display:none;">%password%</td>
\t\t</tr>
\t</tbody>
\t<tfoot>
\t\t<tr style="color: black; font-size: 10px; text-align: center;">
\t\t\t<th colspan="2" ><span class="validity">%validity%</span> <span class="timelimit">%limitUptime%</span> <span>%limitBytesTotal%</span> <span class="price">%price%</span></th>
\t\t</tr>
\t</tfoot>
</table>
<script>
\tif("%username%" == "%password%"){
\t\t$(".vc").show()
\t}else if("%username%" != "%password%"){
\t\t$(".up").show()
\t}
</script>
`

export const SMALL_FOOTER = `
<script>
    if($(".validity")){
        nice('.validity')
    }
    if($(".timelimit")){
        nice('.timelimit')
    }

    if($(".price")){
        $(".price").html(currencyFormat(Number($(".price").html()),currency));
    }
    
    function nice(e){
        var x =  $(e).html();
        if(x.substring(x.length - 1) == "d"){
            $(e).html(x.replace("d","Hari"));
        }else if(x.substring(x.length - 1) == "h"){
            $(e).html(x.replace("h","Jam"));
        }else if(x.substring(x.length - 1) == "w"){
            $(e).html(x.replace("w","Minggu"));
        }
    }
</script>
</body>
</html>`

export const THERMAL_HEADER = `<!DOCTYPE html>
<html>
\t<head>
\t\t<title>Voucher</title>
\t\t<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
\t\t<meta http-equiv="pragma" content="no-cache" />
\t\t<link rel="icon" href="assets/img/favicon.png" />
\t\t<script src="assets/js/jquery.min.js"></script>
\t\t<style>
\t\t\tbody {
\t\t\t\tcolor: #000000;
\t\t\t\tbackground-color: #FFFFFF;
\t\t\t\tfont-size: 14px;
\t\t\t\tfont-family:  'Helvetica', arial, sans-serif;
\t\t\t\tmargin: 0px;
\t\t\t\t-webkit-print-color-adjust: exact;
\t\t\t}
\t\t\ttable.voucher {
\t\t\t\tdisplay: inline-block;
\t\t\t\tborder: 2px solid black;
\t\t\t\tmargin: 2px;
\t\t\t}
\t\t\t@page
\t\t\t{
\t\t\t\tsize: auto;
\t\t\t\tmargin-left: 7mm;
\t\t\t\tmargin-right: 3mm;
\t\t\t\tmargin-top: 9mm;
\t\t\t\tmargin-bottom: 3mm;
\t\t\t}
\t\t\t@media print
\t\t\t{
\t\t\t\ttable { page-break-after:auto }
\t\t\t\ttr    { page-break-inside:avoid; page-break-after:auto }
\t\t\t\ttd    { page-break-inside:avoid; page-break-after:auto }
\t\t\t\tthead { display:table-header-group }
\t\t\t\ttfoot { display:table-footer-group }
\t\t\t}
\t\t\t.rotate {
\t\t\t\tmax-width: 15px;
\t\t\t\twhite-space: nowrap;
\t\t\t\tvertical-align: bottom;
\t\t\t\tpadding-right: 5px;
\t\t\t}

\t\t\t.rotate > div {
\t\t\t\ttransform: rotate(-90deg);
\t\t\t}
\t\t\t.qrcode{
\t\t\t\theight:100px;
\t\t\t\twidth:100px;
\t\t\t}
\t\t\t.vc{
\t\t\t\tdisplay:none;
\t\t\t}\t
\t\t\t.up{
\t\t\t\tdisplay:none;
\t\t\t}
\t\t\t.price{
\t\t\t\tfont-size:20px;

\t\t\t}

\t\t</style>
\t</head>
\t<body>`

export const THERMAL_ROW = `<table class="voucher" style=" width: 180px;">
\t<tbody>
\t\t<tr>
\t\t\t<td style="text-align: center; font-size: 14px; font-weight:bold;">%hotspotName%</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td style="text-align: center; font-size: 14px; border-bottom: 1px black solid;">
\t\t\t\t<img src="%logo%" alt="logo" style="height:30px;border:0;"><br>
\t\t\t\t<span>%timeStamp%</span>
\t\t\t</td>
\t\t</tr>
\t\t<tr>
\t\t\t<td>
\t\t\t\t<table style=" text-align: center; width: 170px; font-size: 12px;">
\t\t\t\t\t<tbody>
\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td>
\t\t\t\t\t\t\t\t<table style="width:100%;">
\t\t\t\t\t\t\t\t\t<tr class="vc">
\t\t\t\t\t\t\t\t\t\t<td font-size: 12px;>Kode Voucher</td>
\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t<tr  class="vc">
\t\t\t\t\t\t\t\t\t\t<td style="width:100%; border: 1px solid black; font-weight:bold; font-size:16px;">%username%</td>
\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t<tr class="up">
\t\t\t\t\t\t\t\t\t\t<td style="width: 50%">Username</td>
\t\t\t\t\t\t\t\t\t\t<td >Password</td>
\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t\t<tr style="font-size: 14px;" class="up">
\t\t\t\t\t\t\t\t\t\t<td style="border: 1px solid black; font-weight:bold;">%username%</td>
\t\t\t\t\t\t\t\t\t\t<td style="border: 1px solid black; font-weight:bold;">%password%</td>
\t\t\t\t\t\t\t\t\t</tr>
\t\t\t\t\t\t\t\t</table>
\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t</tr>

\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td colspan="2" style="border-top: 1px solid black;font-weight:bold; font-size:14px"><span class="validity">%validity%</span> <span class="timelimit">%limitUptime%</span> <span>%limitBytesTotal%</span></td>
\t\t\t\t\t\t</tr>
\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td><span class="price">%price%</span></td>
\t\t\t\t\t\t</tr>
\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td colspan="2">
\t\t\t\t\t\t\t\t<div >%qrCode% </div>
\t\t\t\t\t\t\t\t%comment%
\t\t\t\t\t\t\t</td>
\t\t\t\t\t\t</tr>
\t\t\t\t\t\t<tr>
\t\t\t\t\t\t\t<td colspan="2" style="font-weight:bold; font-size:12px">Login: http://%dnsName%</td>
\t\t\t\t\t\t</tr>
\t\t\t\t\t</tbody>
\t\t\t\t</table>
\t\t\t</td>
\t\t</tr>
\t</tbody>
</table>
<script>
\tif("%username%" == "%password%"){
\t\t$(".vc").show()
\t}else if("%username%" != "%password%"){
\t\t$(".up").show()
\t}
</script>



`

export const THERMAL_FOOTER = SMALL_FOOTER

export type BuiltinTemplate = {
  id: string
  name: string
  type: string
  header: string
  row: string
  footer: string
}

export const BUILTIN_TEMPLATES: BuiltinTemplate[] = [
  {
    id: 'builtin-default',
    name: 'Default',
    type: 'default',
    header: DEFAULT_HEADER,
    row: DEFAULT_ROW,
    footer: DEFAULT_FOOTER,
  },
  {
    id: 'builtin-small',
    name: 'Small',
    type: 'small',
    header: SMALL_HEADER,
    row: SMALL_ROW,
    footer: SMALL_FOOTER,
  },
  {
    id: 'builtin-thermal',
    name: 'Thermal',
    type: 'thermal',
    header: THERMAL_HEADER,
    row: THERMAL_ROW,
    footer: THERMAL_FOOTER,
  },
]
