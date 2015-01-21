define([
	'scripts/app',
	'DocteurCreditJS',
	], function (app,DC) {
	app.factory('Financement', function(){

		function Financement(capital, rate, duration, date){
			
			this.capital = capital;

			this.rate = rate;
			this.initRate = this.rate;

			this.duration = duration;
			
			this.date = date;
			this.dateString = date.toLocaleDateString();
			
			this.monthlyPayment = 0;
			this.variation = {};
			this.cap = {pos:6,neg:6};
			this.refInd = this.newRefInd = 2.9;
			this.amortization = [];
			this.story = 'max';
			this.type = 'fixe';
			this.update();
		}

		Financement.prototype = {
			/* body... */

			update: function (monthlyPayment) {
				this.date = new Date(this.formatDate(this.dateString));
				this.rate = Math.round((Math.pow(1 + (this.initRate/100), 1 / 12) - 1)*1000000)/1000000;
				if(monthlyPayment){
					this.monthlyPayment = monthlyPayment
					this.setDuration();
				}else{
					this.setMonthlyPayment();
				}

				if(this.type.localeCompare('fixe') == 0 ){
					this.variation = {};
					this.setAmortization();
				}else{
					this.setVariation();
					if(this.variation.fixe>= this.duration){
						this.setAmortization();
					}else{
						this.setAmortizationWithVariation();
					}
				}

			},
			setDuration : function (argument) {
				this.duration = Math.floor(DC.CreditUtil.calculDuree(this.rate, this.monthlyPayment/this.capital));
				this.setMonthlyPayment();
			},
			setMonthlyPayment : function(){
				this.monthlyPayment = DC.CreditUtil.calculMensualite(this.rate, this.duration)*this.capital;
			},

			setAmortization : function () {
				this.amortization=[];
				this.initArmortizationVal(0,this.duration, this.duration, this.capital, this.rate);
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},
			setAmortizationWithVariation : function () {
				this.amortization=[];
				this.setMax();
				this.initArmortizationVal(0,this.variation.fixe,this.duration, this.capital, this.rate);
				//this.setIndexationRate();
				switch(this.story){
					case 'max':
						this.calculIndexationMax();
						break;
					case 'min':
						this.calculIndexationMin();
						break;
					case 'same':
						this.calculIndexationSame();
						break;
					case 'limit':
						this.calculIndexationMax();
						break;
					default:
						this.calculIndexationMax();
						break;
				}
				var rate;
				
				for (var i = this.variation.fixe; i < this.duration; i=i+this.variation.reval) {
					var durationLeft = this.duration - i;
					if (this.variation.fixe == 12  && i<= this.variation.fixe+24 && this.rate > DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)) {
						switch(i){
							case this.variation.fixe:
								var one =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(1/100,1));
								rate = one < this.rate ? (one): this.rate;
								console.log(rate*(DC.CreditUtil.calculCapital(rate, durationLeft, i-1)*this.amortization[i-1].SRD));
								break;
							case this.variation.fixe+12:
								var two =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(2/100,1));
								rate = two < this.rate ? (two) : this.rate;
								break;
							case this.variation.fixe+24:
								var three =  this.calculIndexionAdd(DC.CreditUtil.tauxAnToPeriodique(3/100,1));
								rate = three < this.rate ? (three) : this.rate;
						}
					}else{
						rate = this.rate;
					};
					if(this.duration - i == this.duration%this.variation.reval){
						this.initArmortizationVal(i,this.duration, durationLeft, this.amortization[i-1].SRD, rate);
					}else{
						this.initArmortizationVal(i,this.variation.reval+i,durationLeft, this.amortization[i-1].SRD, rate);
					}
				};
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},
			initArmortizationVal : function (position, len, durationLeft, capital, rate){
				var period = 1;
				for (var i = position; i < len; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].rate=DC.CreditUtil.tauxPeriodiqueToAn(rate,1)*100;
					this.amortization[i].monthlyPayment=DC.CreditUtil.calculMensualite(rate, durationLeft)*capital;
					this.amortization[i].SRD=DC.CreditUtil.calculCapital(rate, durationLeft, period)*capital;
					this.amortization[i].interest=this.getInterest(period,durationLeft,capital,rate);
					this.amortization[i].capital=this.amortization[i].monthlyPayment - this.amortization[i].interest;
					this.amortization[i].totalPayment=this.getTotalPayment(i);
					this.amortization[i].totalInterest=this.getTotalInterest(i);
					period++;

				};
				//console.log(this.amortization);
			},
			getYearsAmortization : function(){
				return 'ok';
			},
			getInterest : function (periode, duration, capital,rate) {

					return rate*(DC.CreditUtil.calculCapital(rate, duration, periode-1)*capital);

			},
			getCapital : function (periode) {
					return this.monthlyPayment - this.getInterest(periode);
			},
			getDateTerme : function (periode) {
				var date = new Date(this.date.getTime());
				date.setMonth(date.getMonth()+periode);
				return date.toLocaleDateString();

			},
			getTotalInterest: function (periode) {
				var totInterest;
				if(periode>0){
					totInterest = this.amortization[periode-1].totalInterest+this.amortization[periode].interest;
				}else{
					totInterest = this.amortization[0].interest
				}
				return totInterest;
			},
			getTotalPayment: function (periode) {
				var totPayment;
				if(periode>0){
					totPayment = this.amortization[periode-1].totalPayment+this.amortization[periode].interest+this.amortization[periode].capital;
				}else{
					totPayment = this.amortization[0].interest+this.amortization[0].capital;
				}
				return totPayment;
			},
			round : function (argument) {
				// round à la 5eme decimal
			},
			formatDate : function (date) {
				date.replace('/[-]gi/', '/');
				var datetab = date.split('/');
				var i = datetab[0];
				datetab[0]= datetab[1];
				datetab[1]=i;
				return datetab.join("/");

			},
			getTotalInterestFromPeriode : function (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].interest;
				}

				return total;
			},
			getTotalCapitalFromPeriode : function (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].capital;
				}
				return total;
			},
			getTotalFromPeriode : function  (duration) {
				var periode = this.duration - duration;
				var total=0;
				for(var i=periode; i<this.amortization.length ; i++){
					total += this.amortization[i].interest+this.amortization[i].capital;
				}
				return total;
			},
			setVariation: function (argument) {
				var temp = this.type.split("/");
				this.variation = { 'fixe':temp[0]*12, 'reval':temp[1]*12};
			},
			calculIndexationMax : function (argument) {
				this.rate =  DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)+this.maxInd;
				 
			},
			calculIndexationMin : function (argument) {
				this.rate =  DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)-this.minInd;
			},
			calculIndexationSame : function (){
				var tmp =  DC.CreditUtil.tauxAnToPeriodique(this.newRefInd/100,1) - DC.CreditUtil.tauxAnToPeriodique(this.refInd/100,1);
				var ind;
				if (tmp<0) {
					ind = this.max(Math.abs(tmp),this.minInd);
					ind = 0-ind;
				}else{
					ind = this.max(Math.abs(tmp),this.maxInd);
					ind = ind;
				};
				this.rate =  DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1) + ind; 

			},
			calculIndexionLimite : function (){

			},
			calculIndexionAdd : function (rateToAdd) {
				return DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1)+rateToAdd;
			},
			setMax : function (argument) {
				this.maxInd = this.max(DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1),DC.CreditUtil.tauxAnToPeriodique(this.cap.pos/100,1));
				this.minInd = this.max(DC.CreditUtil.tauxAnToPeriodique(this.initRate/100,1),DC.CreditUtil.tauxAnToPeriodique(this.cap.neg/100,1));
			},
			max : function (a,b) {
				return a<b ? a : b;
			}



		};

		return Financement;

	});
});
