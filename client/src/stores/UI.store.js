import { observable, action, computed } from 'mobx';

class UIStore {
    // Properties
    @observable loaders = 0;

    // Getters
    @computed get loading(){
        return !!this.loaders ? true : false
    }
    //Actions
    @action startLoading(){
        this.loaders++;
    }

    @action finishLoading(){
        this.loaders--;
    }
}

const store = new UIStore();
export default store