define(['DocteurCreditJS','jquery','Scripts/taux.js'], function (DocteurCredit,$)  {
            // body...

            $('#calcbt').click(function (argument) {
                Calcul();
            })
        
            function formatMoney(value, nbDecimal)
            {
                if (nbDecimal == null)
                    nbDecimal = 2;
                return value.toFixed(nbDecimal).replace('.', ',').replace(/\d(?=(\d{3})+\,)/g, '$&.');
            }
            function Calcul() {
                var input = new DocteurCredit.Input();
                input.mensualite = parseFloat($("#Mensualite").val());
                input.dateDeDebut = new Date($("#DateDeDebut").val());
                input.dureeInitialeMois = parseInt($("#DureeInitialeMois").val(), 10);
                input.montantInital = parseFloat($("#montantInital").val());
                var res = input.calcul(GetTaux());
                $("#boxOutput").html("AncienDureeRestanteMois : " + res.ancienDureeRestanteMois+"<br/>"+
                    "AncienMensualite : " + formatMoney(res.ancienMensualite) + "<br/>" +
                    "AncienTaux : " + formatMoney(res.ancienTauxAn*100) + "%<br/>" +
                    "DureeMois : " + res.dureeMois + "<br/>" +
                    "SRD : " + formatMoney(res.srd) + "<br/>" +
                    "TauxAn : " + formatMoney(res.tauxAn*100) + "%<br/>" +
                    "FraisIndemnite : " + formatMoney(res.fraisIndemnite) + "<br/>" +
                    "FraisMainLevee : " + formatMoney(res.fraisMainLevee) + "<br/>" +
                    "FraisHypotheque : " + formatMoney(res.fraisHypotheque) + "<br/>" +
                    "Frais(somme) : " + formatMoney(res.get_frais()) + "<br/>" +
                    "Mensualite : " + formatMoney(res.mensualite) + "<br/>" +
                    "Capital : " + formatMoney(res.capital) + "<br/>" +
                    "AncienCoutTotal : " + formatMoney(res.get_ancienCoutTotal()) + "<br/>" +
                    "CoutTotal : " + formatMoney(res.get_coutTotal()) + "<br/>" +
                    "Gain : " + formatMoney(res.get_gain()) + "<br/>");
            };
        })