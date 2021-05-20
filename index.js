var _pictures = {
    'Weapon': [],
    'WeaponEquipped': null,
    'Helmet': [],
    'BreastPlate': [],
    'Gauntlets': [],
    'Greaves': [],
    'Boots': [],
    'Earrings': [],
    'Necklace': [],
    'Bracelet': [],
    'Ring': [],
}

var itemChosen = "";

var makeSignaller = function () {
    var _subscribers = []; // Private member

    // Return the object that's created
    return {
        // Register a function with the notification system
        add: function (handlerFunction) {
            _subscribers.push(handlerFunction);
        },

        // Loop through all registered functions and call them with passed
        // arguments
        notify: function (args) {
            for (var i = 0; i < _subscribers.length; i++) {
                _subscribers[i](args);
            }
        }
    };
}

// added Item class
class Item {
    constructor(name, description) {
        this.name = name;
        this.dis = description;
    }
}
//

var makeInventoryModel = function () {
    var _limits = 31; // total # of slots in category
    var _inventory = {
        'Weapon': [],
        'Helmet': [],
        'BreastPlate': [],
        'Gauntlets': [],
        'Greaves': [],
        'Boots': [],
        'Earrings': [],
        'Necklace': [],
        'Bracelet': [],
        'Ring': [],
    };
    var _observers = makeSignaller();
    var showedCategory = 'Weapon';
    return {
        addItem: function (category, itemName, itemDis) {
            // added
            if (_inventory[category].length < 29) {
                var item = new Item(itemName, itemDis);
                _inventory[category].push(item);
            }
            else {
                console.log("Inventory " + category + " full");
                console.log(_inventory.category);
            }
            // added ends
            _observers.notify();
        },

        getItems: function () {
            return _inventory[showedCategory];
        },

        getPictures: function () {
            return _pictures[showedCategory];
        },

        changeCategory: function (category) {
            //  console.log(category);
            showedCategory = category;
            _observers.notify();
        },
        swapItems: function (itemPos) {
            if (_inventory[showedCategory][30] != undefined) {
                var temp = _inventory[showedCategory][itemPos];
                var tempImg = _pictures[showedCategory][itemPos];

                _pictures[showedCategory][itemPos] = _pictures[showedCategory][30];
                _inventory[showedCategory][itemPos] = _inventory[showedCategory][30];
                _inventory[showedCategory][30] = temp;
                _pictures[showedCategory][30] = tempImg;

            }
            else {
                _inventory[showedCategory][30] = _inventory[showedCategory][itemPos];
                _inventory[showedCategory][itemPos] = null;
                _pictures[showedCategory][30] = _pictures[showedCategory][itemPos];
                _pictures[showedCategory][itemPos] = null;
            }
            _observers.notify();
        },
        dropItem: function (itemPos) {
            _inventory[showedCategory][itemPos] = null;
            _observers.notify();
        },
        register: function (fxn) {
            _observers.add(fxn);
        }
    };
}

var emptyElement = function (element) {
    while (element.firstChild) {
        element.removeChild(element.firstChild);
    }
}


var makeInventoryView = function (model, viewId) {
    var _model = model;
    var _view = document.getElementById(viewId);
    var _observers = makeSignaller();

    var _showItem = function (item, num, pictures) {

        var newDiv = document.createElement('div');
        newDiv.setAttribute('class', 'item');
        if (item != undefined) {
            //    console.log("something worked");
            var image = document.createElement('img');
            image.setAttribute('src', pictures[num]);//_weaponPictures[num]);
            newDiv.appendChild(image);

        }
        else {
            //  newDiv.innerHTML = 'item' + num;
            //  console.log("Nothing working");
            var image = document.createElement('img');
            image.setAttribute('src', 'Empty.png');
            newDiv.appendChild(image);
        }
        newDiv.setAttribute('id', num);
        newDiv.addEventListener('click', function () {
	    var _btn = document.getElementById("equipBtn");
            var _dropbtn = document.getElementById("dropBtn");
	    _btn.disabled = false;
	    _dropbtn.disabled = false;
            /*if (newDiv.hasChildNodes()) {
                newDiv.removeChild(newDiv.childNodes[0]);
            }*/
            var selectedDiv = document.getElementById('selected');
            var selectedDivName = document.getElementsByClassName('item4Dis')[0];
            var selectedName = document.getElementById('Sname');
            console.log(selectedName);
            var descriptionDiv = document.getElementsByClassName('description')[0];

            if (item != undefined) {
                var tempImage = document.createElement('img');
                tempImage.setAttribute('src', pictures[num]);
                selectedDivName.innerHTML = "";
                itemChosen = item.name;
                selectedDivName.appendChild(tempImage);
                console.log(newDiv.childNodes);
                selectedName.innerHTML = item.name;
                descriptionDiv.innerHTML = item.dis;
            }
            /*  else{
                selectedDivName.innerHTML = "Empty";
        selectedName.innerHTML = "Empty";
                descriptionDiv.innerHTML = "Empty";
              }*/
        });
        _view.append(newDiv);
    }

    emptyElement(_view);
    //console.log("render function");
    return {
        render: function () {
            emptyElement(_view);

            var items = model.getItems();
            var pictures = model.getPictures();
            for (var i = 0; i < 30; i++) {
                _showItem(items[i], i, pictures);
            }
            //  console.log("Rendered");
        },
        register: function (fxn) {
            _observers.add(fxn);
        }
    };
}


var makeSubCategoryControl = function (model, btnId, view) {
    var _btn = document.getElementById(btnId);
    var _observers = makeSignaller();
    _btn.addEventListener('click', function () {
        // console.log("btn clicked");
        model.changeCategory(btnId);
        document.getElementsByClassName('item4Dis')[0].innerHTML = "selected";
        document.getElementsByClassName('description')[0].innerHTML = "description and stat";
        document.getElementById('Sname').innerHTML = "Selected Item Name";
	document.getElementById("equipBtn").disabled = true;
	document.getElementById("dropBtn").disabled = true;
        var items = model.getItems();
        console.log(items);
        if (items[30] != undefined) {
            var imageString = model.getPictures()[30];
            console.log(imageString);
            var image = document.createElement('img');
            image.setAttribute('src', imageString);
            document.getElementsByClassName('Eitem4Dis')[0].innerHTML = "";
            document.getElementsByClassName('Eitem4Dis')[0].appendChild(image);
            document.getElementById('Ename').innerHTML = items[30].name;
            document.getElementsByClassName('Edescription')[0].innerHTML = items[30].dis;
	    document.getElementById("unequipBtn").disabled = false;
        }
        else {
            document.getElementsByClassName('Eitem4Dis')[0].innerHTML = "equiped";
            document.getElementById('Ename').innerHTML = "Current Equiped Item Name";
            document.getElementsByClassName('Edescription')[0].innerHTML = "description and stat";
	    document.getElementById("unequipBtn").disabled = true;
        }
        document.getElementById('subcategory-name').innerHTML = btnId;
        //    console.log("changed category");
        //  model.register(view.render);
        //  _observers.notify();
    });

}

var makeEquipControl = function (model, btnId, view) {
    var _btn = document.getElementById(btnId);
    var _dropbtn = document.getElementById("dropBtn");
    var _observers = makeSignaller();
    var selectedItem = document.getElementsByClassName('item4Dis')[0];
    console.log(selectedItem);
    var innerHTML = selectedItem.innerHTML;
    //console.log(nameSelectedItem);
    var selectedName = document.getElementById('Sname');
    var description = document.getElementsByClassName('description')[0];
    _btn.disabled = true;
    _btn.addEventListener('click', function () {
        console.log(this.selectedItem);
        console.log("equip btn clicked");
        var items = model.getItems();
        console.log(items);
        for (var i = 0; i < 30; i++) {
            if (items[i] != undefined) {
                if (items[i].name === itemChosen) {
                    model.swapItems(i);
                    selectedItem.innerHTML = "selected";
                    document.getElementById('Sname').innerHTML = "Selected Item Name";
                    description.innerHTML = "description and stat";
                    break;
                }
            }
        }
        var image = document.createElement('img');
        var pictures = model.getPictures();
        image.setAttribute('src', pictures[30]);
        document.getElementsByClassName('Eitem4Dis')[0].innerHTML = "";
        document.getElementsByClassName('Eitem4Dis')[0].appendChild(image);
        document.getElementsByClassName('Edescription')[0].innerHTML = items[30].dis;
        document.getElementById('Ename').innerHTML = items[30].name;
	_btn.disabled = true;
	_dropbtn.disabled = true;
	document.getElementById("unequipBtn").disabled = false;

    });
}

var makeDropControl = function (model, btnId, view) {
    var _btn = document.getElementById(btnId);
    _btn.disabled = true;
    var _observers = makeSignaller();
    var selectedItem = document.getElementsByClassName('item4Dis')[0];
    var description = document.getElementsByClassName('description')[0];
    var selName = document.getElementById("Sname");
    _btn.addEventListener('click', function () {
        console.log(selectedItem.innerHTML);
        console.log("Drop btn clicked");
        var items = model.getItems();
        console.log(items);
        for (var i = 0; i < 30; i++) {
            if (items[i] != undefined) {
		console.log(items[i].name);
                if (items[i].name === selName.innerHTML) {
                    model.dropItem(i);
                    selectedItem.innerHTML = "selected";
                    description.innerHTML = "description and stat";
		    selName.innerHTML = "selected item name";
                    break;
                }
            }
        }
	document.getElementById("equipBtn").disabled = true;
	_btn.disabled = true;
    });
}

var makeUnequipedControl = function (model, btnId, view){
	var _btn = document.getElementById(btnId);
	_btn.disabled = true;
	var selectedItem = document.getElementsByClassName('Eitem4Dis')[0];
	var description = document.getElementsByClassName('Edescription')[0];
	 _btn.addEventListener('click', function () {
		var items = model.getItems();
		for( i=0; i<30; i++){
			if(items[i] == undefined){
				model.swapItems(i);
				selectedItem.innerHTML = "equiped";
				document.getElementById('Ename').innerHTML = "Current Equiped Item Name";
                    		description.innerHTML = "description and stat";
				break;
			}
		}
		_btn.disabled = true;
	});
}

document.addEventListener("DOMContentLoaded", function (event) {

    var inventoryModel = makeInventoryModel();
    var view = makeInventoryView(inventoryModel, 'inventoryMenu');
    inventoryModel.register(view.render);

    inventoryModel.addItem('Weapon', 'Sword', 'Overall Damage Item');
    _pictures['Weapon'].push('Copper Sword.png');
    inventoryModel.addItem('Weapon', 'Spear', 'Long Range Damage Item');
    _pictures['Weapon'].push('Spear Weapon.png');
    inventoryModel.addItem('Weapon', 'Dagger', 'Short Range Bleed Item');
    _pictures['Weapon'].push('Dagger Weapon.png');
    inventoryModel.addItem('Weapon', 'Hammer', 'High Damage Low Speed Item');
    _pictures['Weapon'].push('Hammer Weapon.png');
    inventoryModel.addItem('Weapon', 'Katana', 'Fast Precise Short Range Damage Item');
    _pictures['Weapon'].push('Katana Weapon.png');
    inventoryModel.addItem('Weapon', 'DoubleBlade', 'Short Range Fast  Damage Item');
    _pictures['Weapon'].push('Double Blade Weapon.png');
    inventoryModel.addItem('Weapon', 'Mace', 'Short Range Low Fast Damage Item');
    _pictures['Weapon'].push('Mace Weapon.png');
    inventoryModel.addItem('Weapon', 'Claymore', 'Short Range Slow High Stun Damage Item');
    _pictures['Weapon'].push('Claymore Weapon.png');
    inventoryModel.addItem('Weapon', 'Bow', 'Long Ranged Precised Weapon');
    _pictures['Weapon'].push('Bow Weapon.png');

    inventoryModel.addItem('Helmet', 'Steel', 'Reduce Damage From Head');
    _pictures['Helmet'].push('Steel Helmet.png');
    inventoryModel.addItem('Helmet', 'Hades', 'Reduce Stun Duration');
    _pictures['Helmet'].push('Hades Helmet.png');
    inventoryModel.addItem('Helmet', 'Knights', 'Heavily Reduce Damage and Speed');
    _pictures['Helmet'].push('Knight Helmet.png');
    inventoryModel.addItem('Helmet', 'Bikers', 'Increases Stealth Time and Damage taken');
    _pictures['Helmet'].push('Bikers Helmet.png');
    inventoryModel.addItem('Helmet', 'Leather', 'Slightly Reduce Damage');
    _pictures['Helmet'].push('Leather Helmet.png');


    inventoryModel.addItem('BreastPlate', 'Knights', 'Reduced Damage From Heavy Attacks');
    _pictures['BreastPlate'].push('Knight Breastplate.png');
    inventoryModel.addItem('BreastPlate', 'Golden', 'Increase Amount of Money From Loot');
    _pictures['BreastPlate'].push('Golden Breastplate.png');
    inventoryModel.addItem('BreastPlate', 'Cloak', 'Increase Speed and Stealth');
    _pictures['BreastPlate'].push('Cloak Breastplate.png');

    inventoryModel.addItem('Gauntlets', 'Leather', 'Slightly Reduce Damage');
    _pictures['Gauntlets'].push('Leather Gauntlets.png');
    inventoryModel.addItem('Gauntlets', 'Knights', 'Greatly Increase Attack');
    _pictures['Gauntlets'].push('Knight Gauntlets.png');
    inventoryModel.addItem('Gauntlets', 'Foliage', 'Greatly Increase Stealth');
    _pictures['Gauntlets'].push('Foliage Gauntlets.png');
    inventoryModel.addItem('Gauntlets', 'Steel', 'Greatly Reduce Attack Speed, Reduced Damage');
    _pictures['Gauntlets'].push('Steel Gauntlets.png');
    inventoryModel.addItem('Gauntlets', 'Gold', 'Increase Drop Rates');
    _pictures['Gauntlets'].push('Gold Gauntlets.png');

    inventoryModel.addItem('Greaves', 'Leather', 'Slightly Reduce Damage');
    _pictures['Greaves'].push('Leather Greaves.png');
    inventoryModel.addItem('Greaves', 'Knights', 'Greatly Increase Attack');
    _pictures['Greaves'].push('Knight Greaves.png');
    inventoryModel.addItem('Greaves', 'Foliage', 'Greatly Increase Stealth');
    _pictures['Greaves'].push('Foliage Greaves.png');
    inventoryModel.addItem('Greaves', 'Steel', 'Greatly Reduce Attack Speed, Reduced Damage');
    _pictures['Greaves'].push('Steel Greaves.png');
    inventoryModel.addItem('Greaves', 'Gold', 'Increase Drop Rates');
    _pictures['Greaves'].push('Gold Greaves.png');

    inventoryModel.addItem('Boots', 'Leather', 'Slightly Reduce Damage');
    _pictures['Boots'].push('Leather Boots.png');
    inventoryModel.addItem('Boots', 'Knights', 'Greatly Increase Attack');
    _pictures['Boots'].push('Knight Boots.png');
    inventoryModel.addItem('Boots', 'Foliage', 'Greatly Increase Stealth');
    _pictures['Boots'].push('Foliage Boots.png');
    inventoryModel.addItem('Boots', 'Steel', 'Greatly Reduce Attack Speed, Reduced Damage');
    _pictures['Boots'].push('Steel Boots.png');
    inventoryModel.addItem('Boots', 'Gold', 'Increase Drop Rates');
    _pictures['Boots'].push('Gold Boots.png');
    inventoryModel.addItem('Boots', 'Hermes', 'Increase Movement Speed');
    _pictures['Boots'].push('Hermes Boots.png');

    inventoryModel.addItem('Earrings', 'Ruby', 'Increase Attack Damage');
    _pictures['Earrings'].push('Ruby Earrings.png');
    inventoryModel.addItem('Earrings', 'Sapphire', 'Increase Attack Speed');
    _pictures['Earrings'].push('Sapphire Earrings.png');
    inventoryModel.addItem('Earrings', 'Emerald', 'Increase Movement Speed');
    _pictures['Earrings'].push('Emerald Earrings.png');

    inventoryModel.addItem('Necklace', 'Copper', 'Slightly Reduce Damage');
    _pictures['Necklace'].push('Copper Necklace.png');
    inventoryModel.addItem('Necklace', 'Silver', 'Greatly Reduce Damage');
    _pictures['Necklace'].push('Silver Necklace.png');
    inventoryModel.addItem('Necklace', 'Gold', 'Increase Drop Rates');
    _pictures['Necklace'].push('Gold Necklace.png');

    inventoryModel.addItem('Bracelet', 'Ruby', 'Slightly Reduce Damage');
    _pictures['Bracelet'].push('Ruby Bracelet.png');
    inventoryModel.addItem('Bracelet', 'Sapphire', 'Increase Stealth');
    _pictures['Bracelet'].push('Sapphire Bracelet.png');
    inventoryModel.addItem('Bracelet', 'Emerald', 'Increase Stealth Time');
    _pictures['Bracelet'].push('Emerald Bracelet.png');

    inventoryModel.addItem('Ring', 'Ruby', 'Slightly Reduce Damage');
    _pictures['Ring'].push('Ruby Ring.png');
    inventoryModel.addItem('Ring', 'Sapphire', 'Increase Stealth');
    _pictures['Ring'].push('Sapphire Ring.png');
    inventoryModel.addItem('Ring', 'Emerald', 'Increase Stealth Time');
    _pictures['Ring'].push('Emerald Ring.png');

    var weaponControl = makeSubCategoryControl(inventoryModel, 'Weapon', view);
    var helmetControl = makeSubCategoryControl(inventoryModel, 'Helmet', view);
    var breastPlateControl = makeSubCategoryControl(inventoryModel, 'BreastPlate', view);
    var gauntletsControl = makeSubCategoryControl(inventoryModel, 'Gauntlets', view);
    var greavesControl = makeSubCategoryControl(inventoryModel, 'Greaves', view);
    var bootsControl = makeSubCategoryControl(inventoryModel, 'Boots', view);
    var earringsControl = makeSubCategoryControl(inventoryModel, 'Earrings', view);
    var necklaceControl = makeSubCategoryControl(inventoryModel, 'Necklace', view);
    var braceletControl = makeSubCategoryControl(inventoryModel, 'Bracelet', view);
    var ringControl = makeSubCategoryControl(inventoryModel, 'Ring', view);
    var equipBtnControl = makeEquipControl(inventoryModel, 'equipBtn', view);
    var dropBtnControl = makeDropControl(inventoryModel, 'dropBtn', view);
    var unequipBtnControl = makeUnequipedControl(inventoryModel, 'unequipBtn', view);
});