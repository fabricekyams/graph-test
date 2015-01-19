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
			this.cap = {};
			this.amortization = [];
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
				this.initArmortizationVal(0,this.duration, this.duration, this.capital);
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},
			setAmortizationWithVariation : function () {
				console.log('lol');
				this.amortization=[];
				this.initArmortizationVal(0,this.variation.fixe,this.duration, this.capital);
				//this.setIndexationRate();
				for (var i = this.variation.fixe; i < this.duration; i=i+this.variation.reval) {
					console.log(i);
					this.rate += Math.round((Math.pow(1 + (2.61/100), 1 / 12) - 1)*1000000)/1000000;
					var durationLeft = this.duration - i;
					if(this.duration - i == this.duration%this.variation.reval){
						this.initArmortizationVal(i,this.duration, durationLeft, this.amortization[i-1].SRD);
					}else{
						this.initArmortizationVal(i,this.variation.reval+i,durationLeft, this.amortization[i-1].SRD);
					}
				};
				/*this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;*/
			},
			initArmortizationVal : function (position, len, durationLeft, capital){
				var period = 1;
				for (var i = position; i < len; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].monthlyPayment=DC.CreditUtil.calculMensualite(this.rate, durationLeft)*capital;
					this.amortization[i].SRD=DC.CreditUtil.calculCapital(this.rate, durationLeft, period)*capital;
					this.amortization[i].interest=this.getInterest(period,durationLeft,this.amortization[i].monthlyPayment,capital);
					this.amortization[i].capital=this.amortization[i].monthlyPayment - this.amortization[i].interest;
					this.amortization[i].totalPayment=this.monthlyPayment*(i+1);
					this.amortization[i].totalInterest=this.getTotalInterest(i);
					period++;

				};
				//console.log(this.amortization);
			},
			getYearsAmortization : function(){
				return 'ok';
			},
			getInterest : function (periode, duration, monthlyPayment, capital) {
					return this.rate*(DC.CreditUtil.calculCapital(this.rate, duration, periode-1)*capital);

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
			calculIndexation : function (argument) {
				// body...
			} 


		};

		return Financement;

	});
});
