import java.nio.file.Files;
import java.nio.file.Paths;
import java.io.IOException;
import java.util.List;

public class InputConverter {

    public Line[] lines;

    public InputConverter(String filePath) {
        try {
            List<String> fileLines = Files.readAllLines(Paths.get(filePath));
            lines = new Line[fileLines.size()];
            for (int i = 0; i < fileLines.size(); i++) {
                lines[i] = new Line(fileLines.get(i));
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public InputConverter(String filePath, int multiplier) {
        try {
            List<String> fileLines = Files.readAllLines(Paths.get(filePath));
            lines = new Line[fileLines.size()];
            for (int i = 0; i < fileLines.size(); i++) {
                lines[i] = new Line(fileLines.get(i), multiplier);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    public Long countAllPositions() {
        Long count = 0L;
        for (Line line : lines) {
            count += line.countPositions();
        }
        return count;
    }
}