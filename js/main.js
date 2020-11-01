/*
 * Root file that handles instances of all the charts and loads the visualization
 */
( () => {
    let instance = null;

    /**
     * Creates instances for every chart (classes created to handle each chart)
     * Classes defined in the respective javascript files.
     */
    const init = () => {
        //Creating instances for each visualization
        let lengthChartEN = new EnglishLengthChart("english");
        let lengthChartDE = new GermanLengthChart("german");
        // let lengthChartEN = new LengthChart("english");
        // let lengthChartDE = new LengthChart("german");

        // let brushSelection = new BrushSelection();
        // let electoralVoteChart = new ElectoralVoteChart(brushSelection);

        //load story key from model
        //pass this data and instances of all the charts that update on story selection to navbar's constructor
        d3.json("/model/key.json")
            .then( (stories) => {

                //pass the instances of all the charts that update on selection change in navbar
                const navbar = new Navbar( lengthChartEN, lengthChartDE, stories );
                // const navbar = new Navbar( stories );
                navbar.update();
            });
    }

    /**
     *
     * @constructor
     */
    function Main(){
        if(instance  !== null){
            throw new Error("Cannot instantiate more than one Class");
        }
    }

    /**
     *
     * @returns {Main singleton class |*}
     */
    Main.getInstance = () => {
        const self = this;
        if(self.instance == null){
            self.instance = new Main();

            //called only once when the class is initialized
            init();
        }
        return instance;
    }

    Main.getInstance();
})();