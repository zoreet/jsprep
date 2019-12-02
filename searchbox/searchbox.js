import debounce from './debounce.js';

let seal = {
  query: '',
  timestamp: 0
};

export default class {
  constructor(input) {
    // todo check if input is a valid html element
    this.input = input;
    
    this.results = document.createElement('ul');
    this.results = this.input.parentNode.insertBefore(this.results, this.input.nextSibling);
    this.results.addEventListener('click',(event) => {
      let clickedElement = event.target;
      if (clickedElement.className === 'result') {
        this.input.value = clickedElement.innerHTML;
      }
    });

    this.input.addEventListener('keyup', debounce(this.onKeyUp));
  }

  onKeyUp(event) {
    let query = event.target.value;
    if (query !== seal.query) {
      seal.query = query;
      seal.timestamp = Date.now();
      if(query.length) {
        this.getData(query);
      } else {
        this.results.innerHTML = '';
      }
    }
  }

  getData(query) {
    axios
      .get('https://jsonplaceholder.typicode.com/posts', {
        query
      })
      .then((result) => {
        //here I would check if the seal is the same, and if yes call show data
        this.showData(result);
        // consider a resolve();
      });
  }
  
  showData(data) {
    let results = data.data.filter((result) => {
      return result.title.includes(seal.query);
    });

    this.results.innerHTML = '';
    if (results.length) {
      let temp = document.createDocumentFragment();
      results.forEach(result => {
        let li = document.createElement('li');
        li.className = 'result';
        li.innerHTML = result.title;
        temp.append(li);
      });
      this.results.append(temp);
    } else {
      let li = document.createElement('li');
      li.className = 'no-results';
      li.innerHTML = 'No results found';
      this.results.append(li);
    }
  }  
}
