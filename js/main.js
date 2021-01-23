const text = `Каждый из нас понимает очевидную вещь: курс на социально-ориентированный национальный проект не оставляет шанса для стандартных подходов. Как принято считать, предприниматели в сети интернет освещают чрезвычайно интересные особенности картины в целом, однако конкретные выводы, разумеется, функционально разнесены на независимые элементы. Сложно сказать, почему действия представителей оппозиции представляют собой не что иное, как квинтэссенцию победы маркетинга над разумом и должны быть призваны к ответу. Банальные, но неопровержимые выводы, а также сторонники тоталитаризма в науке подвергнуты целой серии независимых исследований. А ещё тщательные исследования конкурентов неоднозначны и будут смешаны с не уникальными данными до степени совершенной неузнаваемости, из-за чего возрастает их статус бесполезности.
С учётом сложившейся международной обстановки, консультация с широким активом предполагает независимые способы реализации распределения внутренних резервов и ресурсов. В целом, конечно, граница обучения кадров прекрасно подходит для реализации системы обучения кадров, соответствующей насущным потребностям. Для современного мира высокое качество позиционных исследований создаёт предпосылки для позиций, занимаемых участниками в отношении поставленных задач.
Являясь всего лишь частью общей картины, сторонники тоталитаризма в науке призывают нас к новым свершениям, которые, в свою очередь, должны быть рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок. А также акционеры крупнейших компаний лишь добавляют фракционных разногласий и объединены в целые кластеры себе подобных. А ещё акционеры крупнейших компаний, вне зависимости от их уровня, должны быть рассмотрены исключительно в разрезе маркетинговых и финансовых предпосылок. Следует отметить, что понимание сути ресурсосберегающих технологий выявляет срочную потребность первоочередных требований.`

const inputElement = document.querySelector('#input');
const textExampleElement = document.querySelector('#textExample');

let letterId = 1;

let startMoment = null;
let started = false;

let letterCounter = 0;
let letterCounter_error = 0;

const lines = getLines(text);

init();

function init() {
    update();

    inputElement.focus();

    inputElement.addEventListener('keydown', function(event){
        const currentLineNumber = getCurrentLineNumber();
        const element = document.querySelector('[data-key="' + event.key.toLowerCase() + '"]');
        const currentLetter = getCurrentLetter();
        
        let isKey = event.key === currentLetter.original;
        let isEnter = event.key === 'Enter' && currentLetter.original === '\n';

        if (event.key !== 'Shift' && event.key !== 'CapsLock' && event.key !== 'Alt') 
            {
                letterCounter ++
            };

        if (!started) {
            started = true;
            startMoment = Date.now();
        }

        if (event.key.startsWith('F') && event.key.length > 1){
            return;
        };

        if (element) {
            element.classList.add('hint');
        };
        console.log(event.key, currentLetter.original)
    
        if (isKey || isEnter ) {
            letterId++;
            update();
        } else {
            event.preventDefault();

            if (event.key !== 'Shift' && event.key !== 'CapsLock' && event.key !== 'Alt') 
                {
                    letterCounter_error ++;

                    for (const line of lines) {
                        for (const letter of line) {
                            if (letter.original === currentLetter.original){
                                letter.success = false;
                            }
                        }
                    };
        
                    update();
                };
        };

        if (currentLineNumber != getCurrentLineNumber()){
            inputElement.value = '';
            event.preventDefault();

            started = false;
            const time = Date.now() - startMoment;
            document.querySelector('#wordsSpeed').textContent = Math.round(letterCounter / (time / 1000 / 60));
            document.querySelector('#errorProcent').textContent = Math.floor(10000 * letterCounter_error / letterCounter) / 100 + '%';

            letterCounter = 0;
            letterCounter_error = 0;
        }
    });
    
    inputElement.addEventListener('keyup', function(event) {
        const element = document.querySelector('[data-key="' + event.key.toLowerCase() + '"]');
        if (element) {
            element.classList.remove('hint');
        };
    });

};

// Принимает длинную строку, возвращает массив строк со служебной информацией
function getLines(text) {
    const lines = [];

    let line = [];
    let idCounter = 0;

    for (const originalLetter of text){
        idCounter++;

        let letter = originalLetter;

        if (letter === ' ') {
            letter = '°';
        };

        if (letter === '\n') {
            letter = '¶\n';
        };

        line.push({
            id: idCounter,
            label: letter,
            original: originalLetter,
            success: true 
        });

        if (line.length >= 70 || letter === '¶\n'){
            lines.push(line);
            line = [];
        }
    };

    if (line.length > 0) {
        lines.push(line)
    };

    return lines;
};

// Принимает строку с объектами со служебной информацией и возвращает html-структуру
function lineToHTML(line) {
    const divElement = document.createElement('div');
    divElement.classList.add('line');

    for (const letter of line){
        const spanElement = document.createElement('span');
        spanElement.textContent = letter.label;

        divElement.append(spanElement);

        if(letterId > letter.id){
            spanElement.classList.add('done')
        } else if (!letter.success) {
            spanElement.classList.add('hint');
        };
    };

    return divElement;

    // <div class="line line-1">
	// 			<span class="done"> На переднем плане, прямо перед</span> 
	// 			<span class="hint">н</span>ами, расположен был дворик, где стоял
	// 		</div>
};

// Возвращает актуальный номер строки
function getCurrentLineNumber() {
    for (let i = 0; i < lines.length; i++) {
        for (const letter of lines[i]){
            if (letter.id === letterId) {
                return i;
            }
        }
    };
};

// Функция обновления 3-х отображаемых актуальных строк textExample
function update() {
    const CurrentLineNumber = getCurrentLineNumber();

    textExampleElement.innerHTML = '';

    for (let i = 0; i < lines.length; i++) {
        const html = lineToHTML(lines[i]);
        textExampleElement.append(html);

        if (i < CurrentLineNumber || i> CurrentLineNumber + 2) {
            html.classList.add('hidden');
        }
    }
}

// Возвращает объект символа ожидаемый программой
function getCurrentLetter () {
    for (const line of lines) {
        for (const letter of line) {
            if (letterId === letter.id) {
                return letter;
            }
        }
    }
};

