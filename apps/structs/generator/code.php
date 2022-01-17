<?php

function startsWith($haystack, $needle) {
     $length = strlen($needle);
     return (substr($haystack, 0, $length) === $needle);
}

class code {

    public static $countStack;
    public static $lines = array();
    public static $stack = array();
    public static $counterHeader;

    public static function init() {
        self::$countStack = 0;
        Line::$even = false;
        Line::$counter = 0;
        Line::$counterInvisible = 0;
        code::$counterHeader = 0;
    }

    public static function initFunction($funcao_header, $return_header = false) {
        echo "<div class='header-div' id='h".code::$counterHeader."'>";
        echo "<div class='Separator'></div>";
        echo "<div class='head-line'><font style='font-size:18px;'>FUNÇÃO</font><br>" . $funcao_header . "</div>";
        if ($return_header) {
            echo "<div class='subhead-item'><font style='font-size:18px;'>RETORNA</font><br>" . $return_header . "</div>";
        }
        echo "<div class='Separator'></div>";
        echo "</div>";
        echo "<div class='code'>";
        self::$lines = array();
        self::$stack = array(&self::$lines);
    }

    public static function l($text = false, $title = false) {
        if ($text) {
            $title = str_replace("'", "\"", $title);
            self::$stack[self::$countStack][] = new Line($text, true, $title);
        } else {
            self::$stack[self::$countStack][] = new Line("&nbsp");
        }
    }

    public static function begin() {
        $newBloco = array();
        self::$stack[self::$countStack][] = &$newBloco;
        self::$countStack++;
        self::$stack[self::$countStack] = &$newBloco;
    }

    public static function end() {
        self::$countStack--;
    }

    private static function writeBegin($total,$lvl) {
        echo '<div class="TabCode">';
        if ($total > 1) {
            $line = new Line("INICIO", true);
            $line->setLvl($lvl);
            $line->write("delimiterUp");
        }
    }

    private static function writeEnd($total,$lvl) {
        if ($total > 1) {
            $line = new Line("FIM", true);
            $line->setLvl($lvl);
            $line->write("delimiterDown");
        }
        echo '</div>';
    }

    private static function writeBloco($lines, $lvl) {
        $total = count($lines);
        if ($lvl != 0) {
            self::writeBegin($total,$lvl);
        }
        for ($i = 0; $i < $total; $i++) {
            if (is_array($lines[$i])) {
                self::writeBloco($lines[$i], $lvl + 1);
            } else {
                if ($i + 1 < $total && is_array($lines[$i + 1])) {
                    $lines[$i]->setLvl($lvl+1);
                    $lines[$i]->write("handlerTab");
                } else {
                    $lines[$i]->setLvl($lvl);
                    $lines[$i]->write();
                }
            }
        }
        if ($lvl != 0) {
            self::writeEnd($total,$lvl);
        }
    }

    public static function write() {
        self::writeBloco(self::$lines, 0);
        echo "</div>";
    }

}

class Line {

    private $text;
    private $title;
    private $useCount;
    public static $even;
    public static $counter;
    public static $counterInvisible;
    public static $counterHeader;
    private $lvl = 0;
    
    function __construct($text, $useCount = false, $title = false) {
        $this->text = $text;
        $this->title = $title;
        $this->useCount = $useCount;
    }
    
    function setLvl($lvl){
        $this->lvl = $lvl + 1;
    }

    function getWidth(){
        return strlen($this->text)*7 + $this->lvl*20;
    }
    
    function write($class = "") {
        $text = $this->text;
        $odd_even = $this->getEvenOddLabel();
        $title = ($this->title ? "title='$this->title'" : "");
        if(startsWith($text,"Enquanto")) {
            $class .= " while_l";
        } else if(startsWith($text,"Se") || startsWith($text,"Senão")){
            $class .= " if_l";
        }
        if ($this->useCount) {
            $id = "id='l" . self::$counter . "'";
            $label = $this->getAfterLabel(self::$counter);
            self::$counter++;
        } else {
            $id = "";
            $label = "";
        }
        $label2 = $this->getAfterLabelInvisible(self::$counterInvisible);
        self::$counterInvisible++;
        echo "<p class='$class $odd_even' $id $label $label2 $title >$text</p>";
    }

    private function getAfterLabel($counter) {
//        if ($counter < 10) {
//            $string = "00$counter";
//        } else if ($counter < 100) {
//            $string = "0$counter";
//        } else {
            $string = $counter;
//        }
        return "counter='$string'";
    }
    
    private function getAfterLabelInvisible($counter) {
//        if ($counter < 10) {
//            $string = "00$counter";
//        } else if ($counter < 100) {
//            $string = "0$counter";
//        } else {
            $string = $counter+1;
//        }
        return "counterI='$string'";
    }

    private function getEvenOddLabel() {
        self::$even = !self::$even;
        if (self::$even) {
            return "even";
        } else {
            return "odd";
        }
    }

}
