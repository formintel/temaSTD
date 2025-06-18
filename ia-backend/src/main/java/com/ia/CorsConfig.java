package com.ia;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permite toate originile în dezvoltare
        config.addAllowedOrigin("http://localhost:4200");
        config.addAllowedOrigin("http://localhost:91");
        config.addAllowedOrigin("http://localhost:90");
        
        // Permite toate metodele HTTP
        config.addAllowedMethod("*");
        
        // Permite toate headerele
        config.addAllowedHeader("*");
        
        // Permite credențialele
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 