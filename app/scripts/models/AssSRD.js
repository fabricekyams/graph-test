define([
	'scripts/app',
	'DocteurCreditJS',
	'moment',
	'scripts/models/DBRead.js'
	], function (app,DC,mm) {
	app.factory('AssSRD', function (DBRead , $http){
		/**
		 * [AssSRD description]
		 * @param {[type]} capital  [description]
		 * @param {[type]} rate     [description]
		 * @param {[type]} duration [description]
		 * @param {[type]} date     [description]
		 */
		function AssSRD(){

			this.prime = 'Prime unique';
			this.amount = 0;
			this.duration = 60;
			this.addRate = 0;
			this.primeTable = [];

			//this.generateRateTable();
			//this.update();

		}

		AssSRD.prototype = {

			setAddRate : function (duration, mpay, rate, capital) {
				console.log(' ');
				console.log(' ');
				console.log('dur', duration);
				var newMp;
				var amount;
				if (this.prime.localeCompare("Prime unique")==0) {
					amount = this.amount;

				}else{
					if (this.prime.localeCompare("Prime annuelle")==0) {
						this.setAnPrimeTable(duration);
						amount = this.getTotalAmount(rate,this.amount);
					}else{
						this.setSuccPrimeTable(this.duration);
						amount = this.getTotalAmount(rate,this.amount);

					}
				};
				this.totAmount = amount;

				newMp = mpay+(amount/duration);
				var newCapital = (capital/*+amount*/);
				console.log('amount: ', amount);
				console.log('oldMP: ', mpay);
				console.log('newMP: ', newMp);
				var nrate = DC.CreditUtil.calculTauxC( newMp/newCapital,duration);
				console.log('new Rate: ',DC.CreditUtil.tauxPeriodiqueToAn(nrate,1)*100);
				console.log('Rate: ', rate);
				var addRate = (DC.CreditUtil.tauxPeriodiqueToAn(nrate,1)*100) - rate;
				this.addRate = addRate;
				console.log('this.addRate: ',this.addRate);
			},
			getTotalAmount : function  (rate,amount) {
				var totAmount = this.amount;
				for (var i = 0; i < this.primeTable.length-1; i++) {
					totAmount+= this.primeTable[i].amount/(1+(rate/100));
				};
				console.log('totAmount: ',totAmount);
				return totAmount;
				
			},
			setAnPrimeTable : function  (duration) {
				var len = Math.round(((duration/12)/3)*2);
				console.log('duration ',duration);
				console.log('len ',len);
				this.primeTable = [];
				for (var i = 0; i < len; i++) {
					this.primeTable[i] = {};
					this.primeTable[i].amount = this.amount;
				};
				console.log(this.primeTable);
			},
			setSuccPrimeTable : function  (duration) {
				console.log('durat', duration);
				var len = Math.ceil(duration/12);
				console.log('lenn ',len);
				console.log('plenn ',this.primeTable.length);
				var j = this.primeTable.length;
				if(len<this.primeTable.length){
					this.primeTable=this.primeTable.slice(0,len);
					console.log('here');
				}else{
					for (var i = j ; i < len; i++) {
						this.primeTable[i] = {};
						this.primeTable[i].amount = this.amount;
					};
				}
				console.log(this.primeTable);
			}


		};

		return AssSRD;

	});
});
