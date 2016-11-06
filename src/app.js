import Controller from './controller';
import View from './view';
import Model from './model';

const controller = new Controller();
controller.init(new View(controller), new Model(controller));
