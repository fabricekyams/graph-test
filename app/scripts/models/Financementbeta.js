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
				this.setAmortization();

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
				for (var i = 0; i < this.duration; i++) {
					this.amortization[i]={};
					this.amortization[i].month='mois: '+(i+1);
					this.amortization[i].dateTerme=this.getDateTerme(i+1);
					this.amortization[i].interest=this.getInterest(i);
					this.amortization[i].capital=this.getCapital(i);
					this.amortization[i].SRD=DC.CreditUtil.calculCapitalWithMensualite(this.rate, this.duration, i+1,(this.monthlyPayment/this.capital))*this.capital;;
					this.amortization[i].monthlyPayment=this.monthlyPayment;
					this.amortization[i].totalPayment=this.monthlyPayment*(i+1);
					this.amortization[i].totalInterest=this.getTotalInterest(i);

				};
				this.totalPayment = this.amortization[this.duration-1].totalPayment;
				this.totalInterest = this.amortization[this.duration-1].totalInterest;
				this.totalCapital = this.totalPayment - this.totalInterest;
			},
			getYearsAmortization : function(){
				return 'ok';
			},
			getInterest : function (periode) {
					return this.rate*(DC.CreditUtil.calculCapital(this.rate, this.duration, periode,(this.monthlyPayment/this.capital))*this.capital);

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
					totInterest = this.amortization[periode-1].totalInterest+this.getInterest(periode);
				}else{
					totInterest = this.getInterest(periode)
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
			}


		};

		return Financement;

	});
});
