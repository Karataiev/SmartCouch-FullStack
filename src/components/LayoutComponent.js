import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React from 'react';
import Svg, {Circle, Defs, RadialGradient, Stop} from 'react-native-svg';

export const LayoutComponent = ({children, addedStyles}) => {
  return (
    <View style={[styles.container, addedStyles]}>
      <Svg height="700" width="700" style={styles.gradientBall}>
        <Defs>
          <RadialGradient
            id="grad"
            cx="50%" // Центр градієнта по X
            cy="50%" // Центр градієнта по Y
            r="70%" // Радіус градієнта — ЗБІЛЬШУЙ для ширшої зони розмиття
            fx="50%" // Фокус по X
            fy="50%" // Фокус по Y
          >
            {/* 
                  ЯСКРАВІСТЬ ЦЕНТРУ: 
                  stopOpacity → 1 — повна яскравість; 0 — прозорість 
                */}
            <Stop
              offset="0%"
              stopColor="#4DAED9"
              stopOpacity="0.7" // Зменш для приглушеного центру
            />

            {/* 
                  ПЕРЕХІД (РОЗМИТІСТЬ): 
                  Збільши offset або зменш stopOpacity — отримаєш м’якіший розплив 
                */}
            <Stop
              offset="0%"
              stopColor="#4DAED9"
              stopOpacity="0.15" // Менше → м’якший перехід
            />

            {/* 
                  КРАЙ ГРАДІЄНТА:
                  Повна прозорість дозволяє кольору фону зливатися плавно
                */}
            <Stop
              offset="78%"
              stopColor="#121313"
              stopOpacity="0" // Повна прозорість
            />
          </RadialGradient>
        </Defs>

        {/* 
              КОЛО, яке "малює" градієнт
              cx, cy — координати центру
              r — розмір кулі
            */}
        <Circle
          cx="350" // Центр по горизонталі (половина width)
          cy="350" // Центр по вертикалі (половина height)
          r="350" // Радіус кулі — більше значення = більша куля
          fill="url(#grad)" // Застосування градієнта
        />
      </Svg>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <>{children}</>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121313', // Базовий фон сторінки
  },
  gradientBall: {
    position: 'absolute',
    top: -350, // Позиція по вертикалі — піднімає кулю вгору
    right: -350, // Позиція по горизонталі — відсуває кулю вправо
    zIndex: 0, // Поміщає кулю позаду іншого контенту
  },
});
