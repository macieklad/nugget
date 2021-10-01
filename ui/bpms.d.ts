declare module 'bpmn-js/lib/Modeler' {
  export default class Modeler extends Viewer {
    constructor(options?: any);

    /**
     * Create a new diagram to start modeling.
     */
    createDiagram(done: any): void;
    importXML(diagram: string): void;
  }
} 

declare module "bpmn-js/dist/bpmn-navigated-viewer.production.min.js" {
  export default class BpmnJS extends Viewer {
    constructor(options?: any);

    /**
     * Create a new diagram to start modeling.
     */
    createDiagram(done: any): void;
    importXML(diagram: string): void;
  }
}