/**
 * Created by Huy on 14/01/2018.
 */

module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    
    this.add = function (item, id, quantity) {
        var storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {item: item, quantity: 0, price: 0};
        }
        storedItem.quantity += quantity;
        storedItem.price = storedItem.item.price * storedItem.quantity;
        this.totalQuantity += quantity;
        this.totalPrice += storedItem.item.price * storedItem.quantity;
    };

    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};