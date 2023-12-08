package src;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class FileReader {
    public static String readFileSync(String fileName) {
        try {
            Path filePath = Paths.get(System.getProperty("user.dir"), "8th", "src", fileName);
            byte[] contentBytes = Files.readAllBytes(filePath);
            String content = new String(contentBytes, "UTF-8");
            return content;
        } catch (IOException e) {
            System.err.println("Error reading file: " + e.getMessage());
            return null;
        }
    }
}