/**
 * Created by Huy on 14/01/2018.
 */

/**
 * Cart handler
 * @param oldCart
 */
module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.totalQuantity = oldCart.totalQuantity || 0;
    this.totalPrice = oldCart.totalPrice || 0;

    /**
     * Add a new item into cart
     * @param item
     * @param id
     * @param quantity
     * @returns {Promise}
     */
    this.add = function (item, id, quantity) {
        var self = this;
        return new Promise(function(resolve, reject){
            var storedItem = self.items[id];
            if (!storedItem) {
                storedItem = self.items[id] = {item: item, quantity: 0, price: 0};
            }
            storedItem.quantity += quantity;
            storedItem.price = storedItem.item.price * storedItem.quantity;
            self.totalQuantity += quantity;
            self.totalPrice += storedItem.item.price * quantity;
            resolve(self);
        });
    };

    /**
     * Edit a cart's item
     * @param id
     * @param quantity
     * @returns {Promise}
     */
    this.edit = function (id, quantity) {
        var self = this;
        return new Promise(function(resolve, reject){
            var storedItem = self.items[id];
            if (!storedItem) {
                reject({
                    'error': 'The stored item was not found'
                });
            }

            // Remove current item's price and item's quantity
            self.totalQuantity -= storedItem.quantity;
            self.totalPrice -= storedItem.price;

            // Set new current item's quantity and calculate new price
            storedItem.quantity = quantity;
            storedItem.price = storedItem.item.price * storedItem.quantity;

            // Calculate the total
            self.totalQuantity += quantity;
            self.totalPrice += storedItem.item.price * quantity;
            resolve(self);
        });
    };

    /**
     * Delete a cart's item
     * @param id
     * @returns {Promise}
     */
    this.delete = function (id) {
        var self = this;
        return new Promise(function(resolve, reject){
            var storedItem = self.items[id];
            if (storedItem) {
                // Remove current item's price and item's quantity
                self.totalQuantity -= storedItem.quantity;
                self.totalPrice -= storedItem.price;

                delete self.items[id];
            }
            resolve(self);
        });
    };

    /**
     * Generate array
     * @returns {Array}
     */
    this.generateArray = function () {
        var arr = [];
        for (var id in this.items) {
            arr.push(this.items[id]);
        }
        return arr;
    };
};