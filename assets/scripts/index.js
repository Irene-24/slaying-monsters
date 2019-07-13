const attackBtn = document.getElementById('attack');
const healBtn = document.getElementById('heal');
const mhp = document.getElementById('mhp');
const php = document.getElementById('php');
const phealth = document.querySelector('#pbar .white');
const mhealth = document.querySelector('#mbar .white');

const restartBtn = document.getElementById('restart');
const modal = document.getElementById('modal');
const message = document.getElementById('message');

//CHARACTER TEMPLATES
class Character
{
    constructor()
    {
        this.health = 100;
        this.turn = 0;
    }

    attack = () =>
    {        
        const moves = 
            {
                kick:10,
                punch:20,
                sword:40
            };
        const keys = Object.keys(moves)  ;
        const index = Math.round((keys.length - 1) * Math.random());    
       
        toggleMovePic(keys[index],this.turn);  
        dealDamage(moves[keys[index]],this.turn);

        if(checkEnd())
        {
            endGame();
        }
        
    }
}

class Player extends Character
{
    constructor()
    {
        super();
        this.healLimit = 3;
    }

    heal = () =>
    {
        if(this.healLimit > 0 )
        {
            if(this.health > 0 && this.health < 100)
            {
                this.health+=5;
                phealth.style.transform = `translateX(${this.health}%)`;
                php.innerHTML = `${this.health}HP`;
                this.healLimit--
                console.log('Player healed',this.health);
            }
        }
        else
        {
            //DISABLE HEALBTN
            console.log('Heal Limit exceeded');
        }

        if(this.healLimit == 0)
        {
            healBtn.disabled= true;
        }


        
    }
}

class Monster extends Character
{
    constructor()
    {
        super();
        this.turn = 1;
    }
    
    attack = () =>
    {
        const moves = 
            {
                scratch:30,
                bite:30,
                roar:10
            };
        const keys = Object.keys(moves)  ;
        const index = Math.round((keys.length - 1) * Math.random());
        toggleMovePic(keys[index],this.turn);  
        dealDamage(moves[keys[index]],this.turn);

        if(checkEnd())
        {
            endGame();
        }
        
    }
}
//CHARACTER TEMPLATES END


//HELPER FUNCTIONS
function dealDamage(pts,playerindex)
{
    let trans = 0;
    if(playerindex==0)
    {
        characters[1].health -= pts;
        if(characters[1].health < 0)
        {
            characters[1].health =0
        }
        trans = characters[1].health;
        console.log("Monster",characters[1].health);
        mhealth.style.transform = `translateX(${-trans}%)`;
        mhp.innerHTML = `${characters[1].health}HP`;

        attackBtn.disabled =true;

        if(!checkEnd())
      {  
          setTimeout(characters[1].attack,2000); 
          setTimeout( ()=> attackBtn.disabled =false ,3000);   
      }    
        
       // playerindex = 1;
    }
    else
    {
        characters[0].health -= pts;
        if(characters[0].health < 0)
        {
            characters[0].health =0
        }
        trans = characters[0].health;
        console.log("Player" ,characters[0].health)
        php.innerHTML = `${characters[0].health}HP`;
        phealth.style.transform = `translateX(${trans}%)`;
        //playerindex = 0;
    }
}

function checkEnd()
{
   if(player.health > 0 && monster.health > 0)
   {
     return false;
   }
   return true;
}

function endGame()
{
    console.log('ended');
    let msg = "GAME OVER!!<br>"
    msg+= player.health > 0 ? "You have slain the monster" : "You were devoured";
    message.innerHTML = msg;
    modal.style.display = "block";
    console.log('------------------')
    healBtn.removeEventListener('click',player.heal);
    attackBtn.removeEventListener('click',player.attack);
    restartBtn.addEventListener('click',init);
}

function toggleMovePic(move,turn)
{
    let original = null
    if(turn == 0)
    {
        original = 'playerInit';
        document.getElementById(original).style.display = "none";
    }
    else
    {
        original = 'monsterInit';
        document.getElementById(original).style.display = "none";
    }
    //document.getElementById(move).style.display = 'block';
    document.getElementById(move).parentElement.classList.toggle('toggle');

    setTimeout(() => {
        document.getElementById(move).parentElement.classList.toggle('toggle');
        document.getElementById(original).style.display = "block";
    }, 1000);
}


function init() 
{
    attackBtn.disabled =false;
    player = new Player();
    monster = new Monster();
    characters = [player,monster];
    modal.style.display = "none";    
    healBtn.disabled= false;
    restartBtn.removeEventListener('click',init);
    healBtn.addEventListener('click',player.heal);
    attackBtn.addEventListener('click',player.attack);
    phealth.style.transform = `translateX(100%)`;
    mhealth.style.transform = `translateX(-100%)`;
    mhp.innerHTML = `100 HP`;
    php.innerHTML = `100 HP`;;
    
   
}

//END HELPER FUNCTIONS

let player = null;
let monster = null;
let characters = [player,monster];
//restartBtn.addEventListener('click',init);

init();
