package com.example.demo.config;

import com.zaxxer.hikari.HikariDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.net.URI;

@Configuration
public class DatabaseConfig {

    @Bean
    @Primary
    public DataSource dataSource() {
        String mysqlUrl = System.getenv("MYSQL_URL");
        String springDsUrl = System.getenv("SPRING_DATASOURCE_URL");
        String dbUser = System.getenv("SPRING_DATASOURCE_USERNAME");
        String dbPass = System.getenv("SPRING_DATASOURCE_PASSWORD");

        HikariDataSource dataSource = new HikariDataSource();

        if (mysqlUrl != null && mysqlUrl.startsWith("mysql://")) {
            try {
                URI uri = new URI(mysqlUrl);
                String host = uri.getHost();
                int port = uri.getPort() == -1 ? 3306 : uri.getPort();
                String path = uri.getPath();
                String userInfo = uri.getUserInfo();

                String username = "root";
                String password = "";

                if (userInfo != null && userInfo.contains(":")) {
                    String[] userParts = userInfo.split(":", 2);
                    username = userParts[0];
                    password = userParts[1];
                }

                String jdbcUrl = "jdbc:mysql://" + host + ":" + port + path + "?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true";

                dataSource.setJdbcUrl(jdbcUrl);
                dataSource.setUsername(username);
                dataSource.setPassword(password);
                dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
                return dataSource;
            } catch (Exception e) {
                // fallback
            }
        }

        if (springDsUrl != null && !springDsUrl.isEmpty()) {
            dataSource.setJdbcUrl(springDsUrl);
            dataSource.setUsername(dbUser != null ? dbUser : "root");
            dataSource.setPassword(dbPass != null ? dbPass : "");
            dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
            return dataSource;
        }

        dataSource.setJdbcUrl("jdbc:mysql://localhost:3306/library_db?useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true&createDatabaseIfNotExist=true");
        dataSource.setUsername("root");
        dataSource.setPassword(System.getenv("DB_PASSWORD") != null ? System.getenv("DB_PASSWORD") : "Boligarla@1");
        dataSource.setDriverClassName("com.mysql.cj.jdbc.Driver");
        return dataSource;
    }
}
