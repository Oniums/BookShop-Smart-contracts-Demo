App = {
  web3Provider: null,
  contracts: {},
  books:null,
  init: async function () {
    return await App.initWeb3();
  },

  initWeb3: async function () {
	  
	  if (window.ethereum) {
      console.log("2");
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      console.log("1");
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      console.log("use ganache");
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    }
    web3 = new Web3(App.web3Provider);
    $(document).on('click', '.btn-purchase', App.purchase);
    return App.initContract();
  },

  initContract: function () {
    $.getJSON('/build/contracts/Transaction.json', function (data) {
      App.contracts.Transaction = TruffleContract(data);
      App.contracts.Transaction.setProvider(App.web3Provider);
	  return App.reload();
    });
  },

  purchase: function () {
    var bookId = parseInt($(event.target).data('id'));
	var bookvalue=$('.panel-pet').eq(bookId-1).find('span').text();
	var value=bookvalue*1000000000000000000;
    var transactionInstance;
    web3.eth.getAccounts(function (error, accounts) {
      if (error) {
        console.log(error);
      }
      console.log(accounts);
      var account = accounts[0];
      App.contracts.Transaction.deployed().then(function (instance) {
        transactionInstance = instance;
        return transactionInstance.purchase(bookId, { from: account, value: value.toString() });
      }).then(function (result) {
        return App.reload();
      }).catch(function (err) {
        console.log(err.message);
      });
    });
  },

  
  reload: function () {
    var transactionInstance;
	$.getJSON('/books.json', function (data) {
	var booksRow = $('#booksRow');
	booksRow.empty();
	var bookTemplate = $('#bookTemplate');
	  App.books=data;
      for (i = 0; i < data.length; i++) {
        bookTemplate.find('.book-name').text(data[i].bookname);
        bookTemplate.find('img').attr('src', data[i].picture);
        bookTemplate.find('.book-value').text(data[i].value);
        bookTemplate.find('.btn-purchase').attr('data-id', data[i].id);
        booksRow.append(bookTemplate.html());
      }
    });
	App.contracts.Transaction.deployed().then(function (instance) {
      transactionInstance = instance;
      return transactionInstance.booksCount();
    }).then(function (booksCount) {
      for (var i = 1; i <= booksCount; i++) {
        transactionInstance.books(i).then(function (book) {
          var state = book[3];
		  var index= book[0].c[0];
		  if (!state) {
			$('.panel-pet').eq(index-1).find('button').text('已售').attr('disabled', true);
        }
        });
      }
    }).catch(function (err) {
      console.log(err.message);
    });
  },

};


$(function () {
  $(window).load(function () {
    App.init();
  });
});
