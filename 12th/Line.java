import java.util.Arrays;
import java.util.stream.Stream;
import java.util.stream.IntStream;

public class Line {
    private Stream<Integer[]> springStream;
    private Integer[] cumulative;

    public Line(String lineInput) {
        initialize(lineInput);
    }

    private void initialize(String lineInput) {
        String[] splitLineInput = lineInput.trim().split(" ");
        // the boolian indicates failure of the spring
        String springTemplate = splitLineInput[0].trim().replace(".", "0").replace("#", "1");
        this.springStream = generateSpringStream(springTemplate);

        this.cumulative = Arrays.stream(splitLineInput[1].trim().split(",")).map(Integer::parseInt).toArray(Integer[]::new);
    }

    public Line(String lineInput, int multiplier) {
        String[] splitLineInput = lineInput.trim().split(" ");
        
        String springTemplateBase = (splitLineInput[0].trim() + "?").repeat(multiplier);
        String springTemplate = springTemplateBase.substring(0, springTemplateBase.length()-1);
        String cumulativeStringBase = (splitLineInput[1].trim()+",").repeat(multiplier);
        String cumulativeString = cumulativeStringBase.substring(0, cumulativeStringBase.length()-1);

        initialize(springTemplate + " " + cumulativeString);
    }

    public Long countPositions() {
        Long amout = springStream.filter(this::isValidSpringArangment).count();
        return amout;
    }

    public Stream<Integer[]> generateSpringStream(String springtemplate) {
        long linit = springtemplate.chars().filter(c -> c == '?').count();
        if (linit == 0) {
            // doule array because stream need sthe wrapper for single element
            return Stream.of(new Integer[][]{fillTemplate(springtemplate, "")});
        }
        return IntStream.range(0, (int) Math.pow(2, linit)).mapToObj(i -> {
            String combination = String.format("%" + linit + "s", Integer.toBinaryString(i)).replace(' ', '0');
            Integer[] filledTemplate = fillTemplate(springtemplate, combination);
            return filledTemplate;
        }).parallel();
    }

    private static Integer[] fillTemplate(String template, String combination) {
        int j = 0;
        Integer[] result = new Integer[template.length()];
        for (int i = 0; i < template.length(); i++) {
            if (template.charAt(i) == '?') {
                result[i] = Integer.parseInt(String.valueOf(combination.charAt(j)));
                j++;
            } else {
                result[i] = Integer.parseInt(String.valueOf(template.charAt(i)));
            }
        }
        return result;
    }

    public Boolean isValidSpringArangment(Integer[] spring) {
        int counter = 0;
        int springIndex = 0;
        try {
            for (int i = 0; i < spring.length; i++) {
                if (spring[i] == 1) {
                    counter++;
                } else if (counter > 0) {
                    // assert: value was 0 and functional spring bevor
                    if (counter != cumulative[springIndex]) {
                        return false;
                    }
                    counter = 0;
                    springIndex++;
                }
            }
            if (counter > 0) {
                // on last array to check
                if (counter != cumulative[springIndex]) {
                    return false;
                } else {
                    springIndex++;
                }
            }

            // check if all springs are used
            if (springIndex != cumulative.length) {
                return false;
            }
            return true;
        } catch (ArrayIndexOutOfBoundsException e) {
            return false;
        }
    }
        
}