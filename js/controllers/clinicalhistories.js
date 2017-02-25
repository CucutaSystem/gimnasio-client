'use strict';

var appGimnasio = angular.module("gimnasio");



appGimnasio.controller('ClinicalListCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', 'Clinicals', '$route', '$routeParams', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, Clinicals, $route, $routeParams, CONFIG) {
    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.msg_btn_deletes = 'Mostrar Eliminados';
    var deletes = true;

  setTimeout(function(){
    var myElementHtml = angular.element(document).find('html');
    myElementHtml = myElementHtml.toggleClass('menu-active');
    var myElementSidebar = angular.element(document).find('#sidebar');
    myElementSidebar = myElementSidebar.toggleClass('toggled');
  }, 1500);

    // For pagination
    $scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.data = []; // initialize
    $scope.filtertext = "";

    $scope.sumCurrentPage = function () {
      $scope.currentPage = $scope.currentPage + 1;
    }

    $scope.lessCurrentPage = function () {
      $scope.currentPage = $scope.currentPage - 1;
    }


    $scope.numberOfPages = function () {

      if ($scope.data != undefined) {
        return Math.ceil($scope.data.length / $scope.pageSize);
      } else {
        return 0;
      }
    }
    // ##############



    $scope.getData = function ()
    {

      $scope.filtertext = "";

      if (deletes) {

        Clinicals.get(function (data)
        {
          $scope.msg_btn_deletes = 'Mostrar Eliminados';
          deletes = false;
          $scope.data = data.clinical;
        });

      } else {

        $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/historias_con_eliminados")
                .success(function (response) {
                  $scope.msg_btn_deletes = 'Ocultar Eliminados';
                  deletes = true;
                  $scope.data = response.clinical;

                });

      }

    }

    $scope.getData();

    $scope.remove = function (id)
    {
      Clinicals.delete({id: id}).$promise.then(function (data) {
        if (data.msg)
        {
          $route.reload();
        }
      });
    }

    $scope.find = function ()
    {

      var $urlfilter = "";
      $scope.msg_btn_deletes = 'Mostrar Eliminados';
      deletes = false;

      if ($.trim($scope.filtertext) != "") {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/historias_con_filtro/" + $scope.filtertext
      } else {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/historias_con_filtro";
      }

      $http.get($urlfilter)
              .success(function (response) {
                $scope.data = response.clinical;
              });

    }

  }]);






appGimnasio.controller('ClinicalShowCtrl', ['$scope', '$rootScope','FingerprintF', '$http', 'ServicePathDomain', '$routeParams', 'Clinicals', 'CONFIG', function ($scope, $rootScope,FingerprintF, $http, ServicePathDomain, $routeParams, Clinicals, CONFIG) {
    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Detalle Historia Clínica",
      action: "Show",
      dateFormat: 'yyyy/MM/dd',
      success: false,
      processing: false
    };

    var id = $routeParams.id;


    Clinicals.get({id: id}, function (data)
    {

      data.clinical.duration_days = parseInt(data.clinical.duration_days);
      $scope.clinical = data.clinical;

    });


    $scope.isEdit = function () {
      return false;
    }

    $scope.isShow = function () {
      return true;
    }


  }]);


appGimnasio.controller('ClinicalCreateCtrl', ['Identifications', 'Clients', '$routeParams', '$scope', '$rootScope', '$timeout', '$location', '$http', 'Clinicals', 'ServicePathDomain', 'CONFIG', function (Identifications, Clients, $routeParams, $scope, $rootScope, $timeout, $location, $http, Clinicals, ServicePathDomain, CONFIG) {
    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Nueva Historia Clínica",
      action: "New",
      dateFormat: 'yyyy/MM/dd',
      openedDateBirthday: false,
      success: false,
      processing: false

    };


    var idcliente = $routeParams.idcliente;

    $scope.history_to_pdf = ServicePathDomain.domain() + CONFIG.URLHTTP + "/historia_a_pdf/" + idcliente;

    $scope.siestaguardando = true;

    Identifications.get(function (data)
    {
      $scope.identifications = data.identifications;
    });

    Clients.get({id: idcliente}, function (data)
    {

      data.client.identification_number = parseInt(data.client.identification_number);
      data.client.fixed_telephone = parseInt(data.client.fixed_telephone);
      data.client.cell_phone = parseInt(data.client.cell_phone);
      data.client.phone_guardian = data.client.phone_guardian;

      $scope.client = data.client;

      $scope.changeAge();

    });


    $scope.imc = function () {
      $scope.clinicalriesgocliente.physical_exam_imc = $scope.clinicalriesgocliente.physical_exam_weight / $scope.clinicalriesgocliente.physical_exam_x2;
    }

    $scope.x2 = function () {
      $scope.clinicalriesgocliente.physical_exam_x2 = $scope.clinicalriesgocliente.physical_exam_size * 2;
      $scope.imc();
    }

    $scope.valueTotalM = function () {
      $scope.clinicalriesgocliente.total_m = $scope.clinicalriesgocliente.tests_anthropometry_basic_total * 0.1429 + 4.56;
    }

    $scope.valueTotalF = function () {
      $scope.clinicalriesgocliente.total_f = $scope.clinicalriesgocliente.tests_anthropometry_basic_total * 0.097 + 3.64;
    }


    $scope.clinicalriesgocliente = {
      clients_id: idcliente,
      last_three_months_visit_doctor: 0,
      last_three_months_visit_orthopedist: 0,
      last_three_months_visit_nutritionist: 0,
      last_three_months_visit_psychologist: 0,
      say_has_high_pressure: 0,
      say_has_low_pressure: 0,
      say_has_myocardial_infarction: 0,
      say_has_asthma: 0,
      say_has_anemia: 0,
      say_has_hernias: 0,
      say_has_tiroides: 0,
      say_has_enfisema: 0,
      say_has_malaria: 0,
      say_has_bronchitis: 0,
      say_has_diabetes: 0,
      say_has_hipoglycemia: 0,
      say_has_anorexia: 0,
      say_has_enf_peptic_acid: 0,
      say_has_drop: 0,
      say_has_neoplasia: 0,
      say_has_rheumatoid: 0,
      say_has_depression: 0,
      say_has_enf_vascular: 0,
      say_has_rheumatic_fever: 0,
      say_has_epilepsy: 0,
      say_has_tonsillopharyngitis: 0,
      say_has_colon: 0,
      say_has_enf_renal: 0,
      say_has_emf_alergic: 0,
      clarification: ' ',
      recent_reviews: ' ',
      heart_diseases_arrhythmias: 0,
      heart_diseases_thrombosis: 0,
      heart_diseases_arteriosclerosis: 0,
      heart_diseases_heart_block: 0,
      heart_diseases_angina_chest: 0,
      heart_diseases_valvular: 0,
      avoid_exercise_other: 0,
      avoid_exercise_which: ' ',
      avoid_exercise_aneurysm: 0,
      avoid_exercise_dysautonomia: 0,
      avoid_exercise_coronary_occlusion: 0,
      avoid_exercise_heart_murmur: 0,
      suffering_headaches_rest: 0,
      suffering_headaches_effort: 0,
      suffering_headaches_after_effort: 0,
      suffering_headaches_no: 0,
      has_been_no: 0,
      has_been_pain: 0,
      has_been_sweat: 0,
      has_been_mareo: 0,
      has_been_faint: 0,
      has_been_seizures: 0,
      has_been_vomiting: 0,
      has_been_blurry_vision: 0,
      related_to_other: 0,
      related_to_main_meal: 0,
      related_to_emotion: 0,
      related_to_cold: 0,
      related_to_exercise: 0,
      related_to_which: ' ',
      has_unconscious: 'N',
      chest_discomfort: 'N',
      blurred_vision_discomfor: 'N',
      lids_inflamed_legs: 'N',
      suffering_tos: 'N',
      exercise_whit_asthma: 'N',
      difficulty_breathing: 'N',
      lipid_altered: 'N',
      vitamin_supplement: 'N',
      musculoskeletal_problems_which: ' ',
      musculoskeletal_problems_yes: 0,
      musculoskeletal_problems_no: 0,
      sleep_medication_which: ' ',
      sleep_medication_yes: 0,
      sleep_medication_no: 0,
      consume_special_medicine_which: ' ',
      consume_special_medicine_yes: 0,
      consume_special_medicine_no: 0,
      sugeries_which: ' ',
      sugeries_yes: 0,
      sugeries_no: 0,
      suffering_stress: 'N',
      back_problems_yes: 0,
      back_problems_no: 0,
      back_problems: ' ',
      back_problems_demonstration: ' ',
      food_consumption_sugar: ' ',
      food_fat_take: ' ',
      smoking_since_when: ' ',
      smoking_how_day: ' ',
      smoking_how_much_leave: ' ',
      smoking_yes: 0,
      smoking_no: 0,
      consume_contraceptives_oral_which: ' ',
      consume_contraceptives_oral_g: ' ',
      consume_contraceptives_oral_p: ' ',
      consume_contraceptives_oral_ces: ' ',
      consume_contraceptives_oral_aliv: ' ',
      consume_contraceptives_oral_yes: ' ',
      consume_contraceptives_oral_no: ' ',
      alcohol_how_many_times_week: ' ',
      alcohol_few_times_month: ' ',
      alcohol_no: 0,
      alcohol_yes: 0,
      alcohol_beer: 0,
      alcohol_wine: 0,
      alcohol_liqueur: 0,
      slepps: 6,
      slepps_repair: 'N',
      risk_factors_cardiovascular: ' ',
      risk_factors_shoulder: ' ',
      risk_factors_knee: ' ',
      risk_factors_lumbar_spine: ' ',
      your_family_parents_heart_infarction: 0,
      your_family_parents_hta: 0,
      your_family_parents_mellitus_diabetes: 0,
      your_family_parents_sudden_death: 0,
      your_family_parents_cerebrovascular_disease: 0,
      your_family_parents_cholesterol: 0,
      your_family_brothers_heart_infarction: 0,
      your_family_brothers_hta: 0,
      your_family_brothers_mellitus_diabetes: 0,
      your_family_brothers_sudden_death: 0,
      your_family_brothers_cerebrovascular_disease: 0,
      your_family_brothers_cholesterol: 0,
      your_family_uncles_heart_infarction: 0,
      your_family_uncles_hta: 0,
      your_family_uncles_mellitus_diabetes: 0,
      your_family_uncles_sudden_death: 0,
      your_family_uncles_cerebrovascular_disease: 0,
      your_family_uncles_cholesterol: 0,
      your_family_grandparents_heart_infarction: 0,
      your_family_grandparents_hta: 0,
      your_family_grandparents_mellitus_diabetes: 0,
      your_family_grandparents_sudden_death: 0,
      your_family_grandparents_cerebrovascular_disease: 0,
      your_family_grandparents_cholesterol: 0,
      menstrual_disorders_yes: 0,
      menstrual_disorders_which: ' ',
      menstrual_disorders_no: 0,
      assessment_position: ' ',
      findings: ' ',
      muscle_assessment: ' ',
      tests_unipodal_supporters_i: 0.0,
      tests_unipodal_supporters_d: 0.0,
      tests_lounge_i: 0.0,
      tests_lounge_d: 0.0,
      tests_squat: 0.0,
      tests_passage_fence_i: 0.0,
      tests_passage_fence_d: 0.0,
      tests_core_fours_i: 0.0,
      tests_core_fours_d: 0.0,
      tests_pelvic_lumbo_control_i: 0.0,
      tests_pelvic_lumbo_control_d: 0.0,
      tests_retraction_hamstrings_i: 0.0,
      tests_retraction_hamstrings_d: 0.0,
      tests_muscular_quadriceps_i: 0.0,
      tests_muscular_quadriceps_d: 0.0,
      tests_rotator_internal_i: 0.0,
      tests_rotator_internal_d: 0.0,
      tests_external_rotators_i: 0.0,
      tests_external_rotators_d: 0.0,
      tests_abdominal_activation: 0.0,
      folds_pant: 0.0,
      folds_muslo: 0.0,
      folds_gluteo: 0.0,
      folds_abd: 0.0,
      folds_cint: 0.0,
      folds_pecho: 0.0,
      folds_hbro: 0.0,
      folds_arm: 0.0,
      folds_biceps: 0.0,
      tests_anthropometry_basic_tr: 0.0,
      tests_anthropometry_basic_se: 0.0,
      tests_anthropometry_basic_si: 0.0,
      tests_anthropometry_basic_abd: 0.0,
      tests_anthropometry_basic_m: 0.0,
      tests_anthropometry_basic_p: 0.0,
      tests_anthropometry_basic_total: 0.0,
      total_f: 0.0,
      total_m: 0.0,
      physical_exam_x2: 0.0,
      physical_exam_imc: 0.0,
      physical_exam_fat: 0.0,
      physical_exam_weight: 0.0,
      physical_exam_size: 0.0,
      cardiovascular_review_blood_pressure: 0.0,
      cardiovascular_review_pulse: 0.0,
      exercise_since: ' ',
      days_week_exercise_long: 0,
      days_week_exercise_hours: 0,
      exercise_last_see: ' ',
      your_goals: ' ',
      recomendations: ' ',
      final_conclusion: ' ',
      fllow_up: ' ',
      clinical_evaluator: ' ',
      family_history_sudden_death: 'N',
      family_history_coronary_disease: 'N',
      recent_surgery_aesthetic: 'N',
      heart_surgery: 'N',
      orthopedic_surgery: 'N',
      injury_ortopedica: 'N',
      diabetes: 'N',
      obesity: 'N',
      rheumatoid_arthritis: 'N',
      less_than_14: 'N',
      current_pregnancy_yes: 0,
      current_pregnancy_no: 0,
      current_pregnancy_monts: ' ',
      physical_disability_yes: 0,
      physical_disability_no: 0,
      physical_disability_no_which: ' ',
      recent_surgery_2months_yes: 0,
      recent_surgery_2months_no: 0,
      recent_surgery_2months_which: ' ',
      cardiac_pathology_no: 0,
      cardiac_pathology_yes: 0,
      cardiac_pathology_which: ' ',
      hypertension_no: 0,
      hypertension_which: ' ',
      hypertension_yes: 0,
      say_has_hepatitis: 0

    };





    Clinicals.get({id: idcliente}, function (data)
    {

      if (data.clinical != "") {

        $scope.siestaguardando = false;

        $scope.clinicalriesgocliente.clients_id = idcliente;

        $scope.clinicalriesgocliente.last_three_months_visit_doctor = fixFormatCharNumber(data.clinical.last_three_months_visit_doctor);
        $scope.clinicalriesgocliente.last_three_months_visit_orthopedist = fixFormatCharNumber(data.clinical.last_three_months_visit_orthopedist);
        $scope.clinicalriesgocliente.last_three_months_visit_nutritionist = fixFormatCharNumber(data.clinical.last_three_months_visit_nutritionist);
        $scope.clinicalriesgocliente.last_three_months_visit_psychologist = fixFormatCharNumber(data.clinical.last_three_months_visit_psychologist);
        $scope.clinicalriesgocliente.say_has_high_pressure = fixFormatCharNumber(data.clinical.say_has_high_pressure);
        $scope.clinicalriesgocliente.say_has_low_pressure = fixFormatCharNumber(data.clinical.say_has_low_pressure);
        $scope.clinicalriesgocliente.say_has_myocardial_infarction = fixFormatCharNumber(data.clinical.say_has_myocardial_infarction);
        $scope.clinicalriesgocliente.say_has_asthma = fixFormatCharNumber(data.clinical.say_has_asthma);
        $scope.clinicalriesgocliente.say_has_anemia = fixFormatCharNumber(data.clinical.say_has_anemia);
        $scope.clinicalriesgocliente.say_has_hernias = fixFormatCharNumber(data.clinical.say_has_hernias);
        $scope.clinicalriesgocliente.say_has_tiroides = fixFormatCharNumber(data.clinical.say_has_tiroides);
        $scope.clinicalriesgocliente.say_has_enfisema = fixFormatCharNumber(data.clinical.say_has_enfisema);
        $scope.clinicalriesgocliente.say_has_malaria = fixFormatCharNumber(data.clinical.say_has_malaria);
        $scope.clinicalriesgocliente.say_has_bronchitis = fixFormatCharNumber(data.clinical.say_has_bronchitis);
        $scope.clinicalriesgocliente.say_has_diabetes = fixFormatCharNumber(data.clinical.say_has_diabetes);
        $scope.clinicalriesgocliente.say_has_hipoglycemia = fixFormatCharNumber(data.clinical.say_has_hipoglycemia);
        $scope.clinicalriesgocliente.say_has_anorexia = fixFormatCharNumber(data.clinical.say_has_anorexia);
        $scope.clinicalriesgocliente.say_has_anemia = fixFormatCharNumber(data.clinical.say_has_anemia);
        $scope.clinicalriesgocliente.say_has_enf_peptic_acid = fixFormatCharNumber(data.clinical.say_has_enf_peptic_acid);
        $scope.clinicalriesgocliente.say_has_drop = fixFormatCharNumber(data.clinical.say_has_drop);
        $scope.clinicalriesgocliente.say_has_neoplasia = fixFormatCharNumber(data.clinical.say_has_neoplasia);
        $scope.clinicalriesgocliente.say_has_rheumatoid = fixFormatCharNumber(data.clinical.say_has_rheumatoid);
        $scope.clinicalriesgocliente.say_has_depression = fixFormatCharNumber(data.clinical.say_has_depression);
        $scope.clinicalriesgocliente.say_has_enf_vascular = fixFormatCharNumber(data.clinical.say_has_enf_vascular);
        $scope.clinicalriesgocliente.say_has_rheumatic_fever = fixFormatCharNumber(data.clinical.say_has_rheumatic_fever);
        $scope.clinicalriesgocliente.say_has_epilepsy = fixFormatCharNumber(data.clinical.say_has_epilepsy);
        $scope.clinicalriesgocliente.say_has_enf_peptic_acid = fixFormatCharNumber(data.clinical.say_has_enf_peptic_acid);
        $scope.clinicalriesgocliente.say_has_tonsillopharyngitis = fixFormatCharNumber(data.clinical.say_has_tonsillopharyngitis);
        $scope.clinicalriesgocliente.say_has_colon = fixFormatCharNumber(data.clinical.say_has_colon);
        $scope.clinicalriesgocliente.say_has_enf_renal = fixFormatCharNumber(data.clinical.say_has_enf_renal);
        $scope.clinicalriesgocliente.say_has_emf_alergic = fixFormatCharNumber(data.clinical.say_has_emf_alergic);
        $scope.clinicalriesgocliente.clarification = fixFormatCharNumber(data.clinical.clarification);
        $scope.clinicalriesgocliente.recent_reviews = fixFormatCharNumber(data.clinical.recent_reviews);
        $scope.clinicalriesgocliente.heart_diseases_arrhythmias = fixFormatCharNumber(data.clinical.heart_diseases_arrhythmias);
        $scope.clinicalriesgocliente.heart_diseases_thrombosis = fixFormatCharNumber(data.clinical.heart_diseases_thrombosis);
        $scope.clinicalriesgocliente.heart_diseases_arteriosclerosis = fixFormatCharNumber(data.clinical.heart_diseases_arteriosclerosis);
        $scope.clinicalriesgocliente.heart_diseases_heart_block = fixFormatCharNumber(data.clinical.heart_diseases_heart_block);
        $scope.clinicalriesgocliente.heart_diseases_angina_chest = fixFormatCharNumber(data.clinical.heart_diseases_angina_chest);
        $scope.clinicalriesgocliente.heart_diseases_valvular = fixFormatCharNumber(data.clinical.heart_diseases_valvular);
        $scope.clinicalriesgocliente.avoid_exercise_other = fixFormatCharNumber(data.clinical.avoid_exercise_other);
        $scope.clinicalriesgocliente.avoid_exercise_which = fixFormatCharNumber(data.clinical.avoid_exercise_which);
        $scope.clinicalriesgocliente.avoid_exercise_aneurysm = fixFormatCharNumber(data.clinical.avoid_exercise_aneurysm);
        $scope.clinicalriesgocliente.avoid_exercise_dysautonomia = fixFormatCharNumber(data.clinical.avoid_exercise_dysautonomia);
        $scope.clinicalriesgocliente.avoid_exercise_coronary_occlusion = fixFormatCharNumber(data.clinical.avoid_exercise_coronary_occlusion);
        $scope.clinicalriesgocliente.avoid_exercise_heart_murmur = fixFormatCharNumber(data.clinical.avoid_exercise_heart_murmur);
        $scope.clinicalriesgocliente.suffering_headaches_rest = fixFormatCharNumber(data.clinical.suffering_headaches_rest);
        $scope.clinicalriesgocliente.suffering_headaches_effort = fixFormatCharNumber(data.clinical.suffering_headaches_effort);
        $scope.clinicalriesgocliente.suffering_headaches_after_effort = fixFormatCharNumber(data.clinical.suffering_headaches_after_effort);
        $scope.clinicalriesgocliente.suffering_headaches_no = fixFormatCharNumber(data.clinical.suffering_headaches_no);
        $scope.clinicalriesgocliente.has_been_no = fixFormatCharNumber(data.clinical.has_been_no);
        $scope.clinicalriesgocliente.has_been_pain = fixFormatCharNumber(data.clinical.has_been_pain);
        $scope.clinicalriesgocliente.has_been_sweat = fixFormatCharNumber(data.clinical.has_been_sweat);
        $scope.clinicalriesgocliente.has_been_mareo = fixFormatCharNumber(data.clinical.has_been_mareo);
        $scope.clinicalriesgocliente.has_been_faint = fixFormatCharNumber(data.clinical.has_been_faint);
        $scope.clinicalriesgocliente.has_been_seizures = fixFormatCharNumber(data.clinical.has_been_seizures);
        $scope.clinicalriesgocliente.has_been_vomiting = fixFormatCharNumber(data.clinical.has_been_vomiting);
        $scope.clinicalriesgocliente.has_been_blurry_vision = fixFormatCharNumber(data.clinical.has_been_blurry_vision);
        $scope.clinicalriesgocliente.related_to_other = fixFormatCharNumber(data.clinical.related_to_other);
        $scope.clinicalriesgocliente.related_to_main_meal = fixFormatCharNumber(data.clinical.related_to_main_meal);
        $scope.clinicalriesgocliente.related_to_emotion = fixFormatCharNumber(data.clinical.related_to_emotion);
        $scope.clinicalriesgocliente.related_to_cold = fixFormatCharNumber(data.clinical.related_to_cold);
        $scope.clinicalriesgocliente.related_to_exercise = fixFormatCharNumber(data.clinical.related_to_exercise);
        $scope.clinicalriesgocliente.related_to_which = fixFormatCharNumber(data.clinical.related_to_which);
        $scope.clinicalriesgocliente.has_unconscious = fixFormatCharNumber(data.clinical.has_unconscious);
        $scope.clinicalriesgocliente.chest_discomfort = fixFormatCharNumber(data.clinical.chest_discomfort);
        $scope.clinicalriesgocliente.blurred_vision_discomfor = fixFormatCharNumber(data.clinical.blurred_vision_discomfor);
        $scope.clinicalriesgocliente.lids_inflamed_legs = fixFormatCharNumber(data.clinical.lids_inflamed_legs);
        $scope.clinicalriesgocliente.suffering_tos = fixFormatCharNumber(data.clinical.suffering_tos);
        $scope.clinicalriesgocliente.exercise_whit_asthma = fixFormatCharNumber(data.clinical.exercise_whit_asthma);
        $scope.clinicalriesgocliente.difficulty_breathing = fixFormatCharNumber(data.clinical.difficulty_breathing);
        $scope.clinicalriesgocliente.lipid_altered = fixFormatCharNumber(data.clinical.lipid_altered);
        $scope.clinicalriesgocliente.vitamin_supplement = fixFormatCharNumber(data.clinical.vitamin_supplement);
        $scope.clinicalriesgocliente.musculoskeletal_problems_which = fixFormatCharNumber(data.clinical.musculoskeletal_problems_which);
        $scope.clinicalriesgocliente.musculoskeletal_problems_yes = fixFormatCharNumber(data.clinical.musculoskeletal_problems_yes);
        $scope.clinicalriesgocliente.musculoskeletal_problems_no = fixFormatCharNumber(data.clinical.musculoskeletal_problems_no);
        $scope.clinicalriesgocliente.sleep_medication_which = fixFormatCharNumber(data.clinical.sleep_medication_which);
        $scope.clinicalriesgocliente.sleep_medication_yes = fixFormatCharNumber(data.clinical.sleep_medication_yes);
        $scope.clinicalriesgocliente.sleep_medication_no = fixFormatCharNumber(data.clinical.sleep_medication_no);
        $scope.clinicalriesgocliente.consume_special_medicine_which = fixFormatCharNumber(data.clinical.consume_special_medicine_which);
        $scope.clinicalriesgocliente.consume_special_medicine_yes = fixFormatCharNumber(data.clinical.consume_special_medicine_yes);
        $scope.clinicalriesgocliente.consume_special_medicine_no = fixFormatCharNumber(data.clinical.consume_special_medicine_no);
        $scope.clinicalriesgocliente.sugeries_which = fixFormatCharNumber(data.clinical.sugeries_which);
        $scope.clinicalriesgocliente.sugeries_yes = fixFormatCharNumber(data.clinical.sugeries_yes);
        $scope.clinicalriesgocliente.sugeries_no = fixFormatCharNumber(data.clinical.sugeries_no);
        $scope.clinicalriesgocliente.suffering_stress = fixFormatCharNumber(data.clinical.suffering_stress);
        $scope.clinicalriesgocliente.back_problems_yes = fixFormatCharNumber(data.clinical.back_problems_yes);
        $scope.clinicalriesgocliente.back_problems_no = fixFormatCharNumber(data.clinical.back_problems_no);
        $scope.clinicalriesgocliente.back_problems = fixFormatCharNumber(data.clinical.back_problems);
        $scope.clinicalriesgocliente.back_problems_demonstration = fixFormatCharNumber(data.clinical.back_problems_demonstration);
        $scope.clinicalriesgocliente.food_consumption_sugar = fixFormatCharNumber(data.clinical.food_consumption_sugar);
        $scope.clinicalriesgocliente.food_fat_take = fixFormatCharNumber(data.clinical.food_fat_take);
        $scope.clinicalriesgocliente.smoking_since_when = fixFormatCharNumber(data.clinical.smoking_since_when);
        $scope.clinicalriesgocliente.smoking_how_day = fixFormatCharNumber(data.clinical.smoking_how_day);
        $scope.clinicalriesgocliente.smoking_how_much_leave = fixFormatCharNumber(data.clinical.smoking_how_much_leave);
        $scope.clinicalriesgocliente.smoking_yes = fixFormatCharNumber(data.clinical.smoking_yes);
        $scope.clinicalriesgocliente.smoking_no = fixFormatCharNumber(data.clinical.smoking_no);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_which = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_which);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_g = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_g);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_p = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_p);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_ces = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_ces);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_aliv = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_aliv);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_yes = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_yes);
        $scope.clinicalriesgocliente.consume_contraceptives_oral_no = fixFormatCharNumber(data.clinical.consume_contraceptives_oral_no);
        $scope.clinicalriesgocliente.alcohol_how_many_times_week = fixFormatCharNumber(data.clinical.alcohol_how_many_times_week);
        $scope.clinicalriesgocliente.alcohol_few_times_month = fixFormatCharNumber(data.clinical.alcohol_few_times_month);
        $scope.clinicalriesgocliente.alcohol_no = fixFormatCharNumber(data.clinical.alcohol_no);
        $scope.clinicalriesgocliente.alcohol_yes = fixFormatCharNumber(data.clinical.alcohol_yes);
        $scope.clinicalriesgocliente.alcohol_beer = fixFormatCharNumber(data.clinical.alcohol_beer);
        $scope.clinicalriesgocliente.alcohol_wine = fixFormatCharNumber(data.clinical.alcohol_wine);
        $scope.clinicalriesgocliente.alcohol_liqueur = fixFormatCharNumber(data.clinical.alcohol_liqueur);
        $scope.clinicalriesgocliente.slepps = fixFormatCharNumber(data.clinical.slepps);
        $scope.clinicalriesgocliente.slepps_repair = fixFormatCharNumber(data.clinical.slepps_repair);
        $scope.clinicalriesgocliente.risk_factors_cardiovascular = fixFormatCharNumber(data.clinical.risk_factors_cardiovascular);
        $scope.clinicalriesgocliente.risk_factors_shoulder = fixFormatCharNumber(data.clinical.risk_factors_shoulder);
        $scope.clinicalriesgocliente.risk_factors_knee = fixFormatCharNumber(data.clinical.risk_factors_knee);
        $scope.clinicalriesgocliente.risk_factors_lumbar_spine = fixFormatCharNumber(data.clinical.risk_factors_lumbar_spine);
        $scope.clinicalriesgocliente.your_family_parents_heart_infarction = fixFormatCharNumber(data.clinical.your_family_parents_heart_infarction);
        $scope.clinicalriesgocliente.your_family_parents_hta = fixFormatCharNumber(data.clinical.your_family_parents_hta);
        $scope.clinicalriesgocliente.your_family_parents_mellitus_diabetes = fixFormatCharNumber(data.clinical.your_family_parents_mellitus_diabetes);
        $scope.clinicalriesgocliente.your_family_parents_sudden_death = fixFormatCharNumber(data.clinical.your_family_parents_sudden_death);
        $scope.clinicalriesgocliente.your_family_parents_cerebrovascular_disease = fixFormatCharNumber(data.clinical.your_family_parents_cerebrovascular_disease);
        $scope.clinicalriesgocliente.your_family_parents_cholesterol = fixFormatCharNumber(data.clinical.your_family_parents_cholesterol);
        $scope.clinicalriesgocliente.your_family_brothers_heart_infarction = fixFormatCharNumber(data.clinical.your_family_brothers_heart_infarction);
        $scope.clinicalriesgocliente.your_family_brothers_hta = fixFormatCharNumber(data.clinical.your_family_brothers_hta);
        $scope.clinicalriesgocliente.your_family_brothers_mellitus_diabetes = fixFormatCharNumber(data.clinical.your_family_brothers_mellitus_diabetes);
        $scope.clinicalriesgocliente.your_family_brothers_sudden_death = fixFormatCharNumber(data.clinical.your_family_brothers_sudden_death);
        $scope.clinicalriesgocliente.your_family_brothers_cerebrovascular_disease = fixFormatCharNumber(data.clinical.your_family_brothers_cerebrovascular_disease);
        $scope.clinicalriesgocliente.your_family_brothers_cholesterol = fixFormatCharNumber(data.clinical.your_family_brothers_cholesterol);
        $scope.clinicalriesgocliente.your_family_uncles_heart_infarction = fixFormatCharNumber(data.clinical.your_family_uncles_heart_infarction);
        $scope.clinicalriesgocliente.your_family_uncles_hta = fixFormatCharNumber(data.clinical.your_family_uncles_hta);
        $scope.clinicalriesgocliente.your_family_uncles_mellitus_diabetes = fixFormatCharNumber(data.clinical.your_family_uncles_mellitus_diabetes);
        $scope.clinicalriesgocliente.your_family_uncles_sudden_death = fixFormatCharNumber(data.clinical.your_family_uncles_sudden_death);
        $scope.clinicalriesgocliente.your_family_uncles_cerebrovascular_disease = fixFormatCharNumber(data.clinical.your_family_uncles_cerebrovascular_disease);
        $scope.clinicalriesgocliente.your_family_uncles_cholesterol = fixFormatCharNumber(data.clinical.your_family_uncles_cholesterol);
        $scope.clinicalriesgocliente.your_family_grandparents_heart_infarction = fixFormatCharNumber(data.clinical.your_family_grandparents_heart_infarction);
        $scope.clinicalriesgocliente.your_family_grandparents_hta = fixFormatCharNumber(data.clinical.your_family_grandparents_hta);
        $scope.clinicalriesgocliente.your_family_grandparents_mellitus_diabetes = fixFormatCharNumber(data.clinical.your_family_grandparents_mellitus_diabetes);
        $scope.clinicalriesgocliente.your_family_grandparents_sudden_death = fixFormatCharNumber(data.clinical.your_family_grandparents_sudden_death);
        $scope.clinicalriesgocliente.your_family_grandparents_cerebrovascular_disease = fixFormatCharNumber(data.clinical.your_family_grandparents_cerebrovascular_disease);
        $scope.clinicalriesgocliente.your_family_grandparents_cholesterol = fixFormatCharNumber(data.clinical.your_family_grandparents_cholesterol);
        $scope.clinicalriesgocliente.menstrual_disorders_yes = fixFormatCharNumber(data.clinical.menstrual_disorders_yes);
        $scope.clinicalriesgocliente.menstrual_disorders_which = fixFormatCharNumber(data.clinical.menstrual_disorders_which);
        $scope.clinicalriesgocliente.menstrual_disorders_no = fixFormatCharNumber(data.clinical.menstrual_disorders_no);
        $scope.clinicalriesgocliente.assessment_position = fixFormatCharNumber(data.clinical.assessment_position);
        $scope.clinicalriesgocliente.findings = fixFormatCharNumber(data.clinical.findings);
        $scope.clinicalriesgocliente.muscle_assessment = fixFormatCharNumber(data.clinical.muscle_assessment);
        data.clinical.tests_unipodal_supporters_i = parseFloat(data.clinical.tests_unipodal_supporters_i);
        $scope.clinicalriesgocliente.tests_unipodal_supporters_i = fixFormatCharNumber(data.clinical.tests_unipodal_supporters_i);
        data.clinical.tests_unipodal_supporters_d = parseFloat(data.clinical.tests_unipodal_supporters_d);
        $scope.clinicalriesgocliente.tests_unipodal_supporters_d = fixFormatCharNumber(data.clinical.tests_unipodal_supporters_d);
        data.clinical.tests_lounge_i = parseFloat(data.clinical.tests_lounge_i);
        $scope.clinicalriesgocliente.tests_lounge_i = fixFormatCharNumber(data.clinical.tests_lounge_i);
        data.clinical.tests_lounge_d = parseFloat(data.clinical.tests_lounge_d);
        $scope.clinicalriesgocliente.tests_lounge_d = fixFormatCharNumber(data.clinical.tests_lounge_d);
        data.clinical.tests_squat = parseFloat(data.clinical.tests_squat);
        $scope.clinicalriesgocliente.tests_squat = fixFormatCharNumber(data.clinical.tests_squat);
        data.clinical.tests_passage_fence_i = parseFloat(data.clinical.tests_passage_fence_i);
        $scope.clinicalriesgocliente.tests_passage_fence_i = fixFormatCharNumber(data.clinical.tests_passage_fence_i);
        data.clinical.tests_passage_fence_d = parseFloat(data.clinical.tests_passage_fence_d);
        $scope.clinicalriesgocliente.tests_passage_fence_d = fixFormatCharNumber(data.clinical.tests_passage_fence_d);
        data.clinical.tests_core_fours_i = parseFloat(data.clinical.tests_core_fours_i);
        $scope.clinicalriesgocliente.tests_core_fours_i = fixFormatCharNumber(data.clinical.tests_core_fours_i);
        data.clinical.tests_core_fours_d = parseInt(data.clinical.tests_core_fours_d);
        $scope.clinicalriesgocliente.tests_core_fours_d = fixFormatCharNumber(data.clinical.tests_core_fours_d);
        data.clinical.tests_pelvic_lumbo_control_i = parseFloat(data.clinical.tests_pelvic_lumbo_control_i);
        $scope.clinicalriesgocliente.tests_pelvic_lumbo_control_i = fixFormatCharNumber(data.clinical.tests_pelvic_lumbo_control_i);
        data.clinical.tests_pelvic_lumbo_control_d = parseFloat(data.clinical.tests_pelvic_lumbo_control_d);
        $scope.clinicalriesgocliente.tests_pelvic_lumbo_control_d = fixFormatCharNumber(data.clinical.tests_pelvic_lumbo_control_d);
        data.clinical.tests_retraction_hamstrings_i = parseFloat(data.clinical.tests_retraction_hamstrings_i);
        $scope.clinicalriesgocliente.tests_retraction_hamstrings_i = fixFormatCharNumber(data.clinical.tests_retraction_hamstrings_i);
        data.clinical.tests_retraction_hamstrings_d = parseFloat(data.clinical.tests_retraction_hamstrings_d);
        $scope.clinicalriesgocliente.tests_retraction_hamstrings_d = fixFormatCharNumber(data.clinical.tests_retraction_hamstrings_d);
        data.clinical.tests_muscular_quadriceps_i = parseFloat(data.clinical.tests_muscular_quadriceps_i);
        $scope.clinicalriesgocliente.tests_muscular_quadriceps_i = fixFormatCharNumber(data.clinical.tests_muscular_quadriceps_i);
        data.clinical.tests_muscular_quadriceps_d = parseFloat(data.clinical.tests_muscular_quadriceps_d);
        $scope.clinicalriesgocliente.tests_muscular_quadriceps_d = fixFormatCharNumber(data.clinical.tests_muscular_quadriceps_d);
        data.clinical.tests_rotator_internal_i = parseFloat(data.clinical.tests_rotator_internal_i);
        $scope.clinicalriesgocliente.tests_rotator_internal_i = fixFormatCharNumber(data.clinical.tests_rotator_internal_i);
        data.clinical.tests_rotator_internal_d = parseFloat(data.clinical.tests_rotator_internal_d);
        $scope.clinicalriesgocliente.tests_rotator_internal_d = fixFormatCharNumber(data.clinical.tests_rotator_internal_d);
        data.clinical.tests_external_rotators_i = parseFloat(data.clinical.tests_external_rotators_i);
        $scope.clinicalriesgocliente.tests_external_rotators_i = fixFormatCharNumber(data.clinical.tests_external_rotators_i);
        data.clinical.tests_external_rotators_d = parseFloat(data.clinical.tests_external_rotators_d);
        $scope.clinicalriesgocliente.tests_external_rotators_d = fixFormatCharNumber(data.clinical.tests_external_rotators_d);
        data.clinical.tests_abdominal_activation = parseFloat(data.clinical.tests_abdominal_activation);
        $scope.clinicalriesgocliente.tests_abdominal_activation = fixFormatCharNumber(data.clinical.tests_abdominal_activation);
        data.clinical.folds_pant = parseFloat(data.clinical.folds_pant);
        $scope.clinicalriesgocliente.folds_pant = fixFormatCharNumber(data.clinical.folds_pant);
        data.clinical.folds_muslo = parseFloat(data.clinical.folds_muslo);
        $scope.clinicalriesgocliente.folds_muslo = fixFormatCharNumber(data.clinical.folds_muslo);
        data.clinical.folds_gluteo = parseFloat(data.clinical.folds_gluteo);
        $scope.clinicalriesgocliente.folds_gluteo = fixFormatCharNumber(data.clinical.folds_gluteo);
        data.clinical.folds_abd = parseFloat(data.clinical.folds_abd);
        $scope.clinicalriesgocliente.folds_abd = fixFormatCharNumber(data.clinical.folds_abd);
        data.clinical.folds_cint = parseFloat(data.clinical.folds_cint);
        $scope.clinicalriesgocliente.folds_cint = fixFormatCharNumber(data.clinical.folds_cint);
        data.clinical.folds_pecho = parseFloat(data.clinical.folds_pecho);
        $scope.clinicalriesgocliente.folds_pecho = fixFormatCharNumber(data.clinical.folds_pecho);
        data.clinical.folds_hbro = parseFloat(data.clinical.folds_hbro);
        $scope.clinicalriesgocliente.folds_hbro = fixFormatCharNumber(data.clinical.folds_hbro);
        data.clinical.folds_arm = parseFloat(data.clinical.folds_arm);
        $scope.clinicalriesgocliente.folds_arm = fixFormatCharNumber(data.clinical.folds_arm);
        data.clinical.folds_biceps = parseFloat(data.clinical.folds_biceps);
        $scope.clinicalriesgocliente.folds_biceps = fixFormatCharNumber(data.clinical.folds_biceps);
        data.clinical.tests_anthropometry_basic_tr = parseFloat(data.clinical.tests_anthropometry_basic_tr);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_tr = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_tr);
        data.clinical.tests_anthropometry_basic_se = parseFloat(data.clinical.tests_anthropometry_basic_se);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_se = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_se);
        data.clinical.tests_anthropometry_basic_si = parseFloat(data.clinical.tests_anthropometry_basic_si);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_si = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_si);
        data.clinical.tests_anthropometry_basic_abd = parseFloat(data.clinical.tests_anthropometry_basic_abd);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_abd = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_abd);
        data.clinical.tests_anthropometry_basic_m = parseFloat(data.clinical.tests_anthropometry_basic_m);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_m = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_m);
        data.clinical.tests_anthropometry_basic_p = parseFloat(data.clinical.tests_anthropometry_basic_p);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_p = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_p);
        data.clinical.tests_anthropometry_basic_total = parseFloat(data.clinical.tests_anthropometry_basic_total);
        $scope.clinicalriesgocliente.tests_anthropometry_basic_total = fixFormatCharNumber(data.clinical.tests_anthropometry_basic_total);

        data.clinical.total_f = parseFloat(data.clinical.total_f);
        $scope.clinicalriesgocliente.total_f = fixFormatCharNumber(data.clinical.total_f);

        data.clinical.total_m = parseFloat(data.clinical.total_m);
        $scope.clinicalriesgocliente.total_m = fixFormatCharNumber(data.clinical.total_m);

        data.clinical.physical_exam_x2 = parseFloat(data.clinical.physical_exam_x2);
        $scope.clinicalriesgocliente.physical_exam_x2 = fixFormatCharNumber(data.clinical.physical_exam_x2);
        data.clinical.physical_exam_imc = parseFloat(data.clinical.physical_exam_imc);
        $scope.clinicalriesgocliente.physical_exam_imc = fixFormatCharNumber(data.clinical.physical_exam_imc);
        data.clinical.physical_exam_fat = parseFloat(data.clinical.physical_exam_fat);
        $scope.clinicalriesgocliente.physical_exam_fat = fixFormatCharNumber(data.clinical.physical_exam_fat);
        data.clinical.physical_exam_weight = parseFloat(data.clinical.physical_exam_weight);
        $scope.clinicalriesgocliente.physical_exam_weight = fixFormatCharNumber(data.clinical.physical_exam_weight);
        data.clinical.physical_exam_size = parseFloat(data.clinical.physical_exam_size);
        $scope.clinicalriesgocliente.physical_exam_size = fixFormatCharNumber(data.clinical.physical_exam_size);
        $scope.clinicalriesgocliente.cardiovascular_review_blood_pressure = fixFormatCharNumber(data.clinical.cardiovascular_review_blood_pressure);
        $scope.clinicalriesgocliente.cardiovascular_review_pulse = fixFormatCharNumber(data.clinical.cardiovascular_review_pulse);
        $scope.clinicalriesgocliente.exercise_since = fixFormatCharNumber(data.clinical.exercise_since);
        $scope.clinicalriesgocliente.days_week_exercise_long = fixFormatCharNumber(data.clinical.days_week_exercise_long);
        $scope.clinicalriesgocliente.days_week_exercise_hours = fixFormatCharNumber(data.clinical.days_week_exercise_hours);
        $scope.clinicalriesgocliente.exercise_last_see = fixFormatCharNumber(data.clinical.exercise_last_see);
        $scope.clinicalriesgocliente.your_goals = fixFormatCharNumber(data.clinical.your_goals);
        $scope.clinicalriesgocliente.recomendations = fixFormatCharNumber(data.clinical.recomendations);
        $scope.clinicalriesgocliente.final_conclusion = fixFormatCharNumber(data.clinical.final_conclusion);
        $scope.clinicalriesgocliente.fllow_up = fixFormatCharNumber(data.clinical.fllow_up);
        $scope.clinicalriesgocliente.clinical_evaluator = fixFormatCharNumber(data.clinical.clinical_evaluator);


      }

      if (data.riesgo != "") {

        $scope.siestaguardando = false;

        $scope.clinicalriesgocliente.family_history_sudden_death = fixFormatCharNumber(data.riesgo.family_history_sudden_death);
        $scope.clinicalriesgocliente.family_history_coronary_disease = fixFormatCharNumber(data.riesgo.family_history_coronary_disease);
        $scope.clinicalriesgocliente.recent_surgery_aesthetic = fixFormatCharNumber(data.riesgo.recent_surgery_aesthetic);
        $scope.clinicalriesgocliente.heart_surgery = fixFormatCharNumber(data.riesgo.heart_surgery);
        $scope.clinicalriesgocliente.orthopedic_surgery = fixFormatCharNumber(data.riesgo.orthopedic_surgery);
        $scope.clinicalriesgocliente.injury_ortopedica = fixFormatCharNumber(data.riesgo.injury_ortopedica);
        $scope.clinicalriesgocliente.diabetes = fixFormatCharNumber(data.riesgo.diabetes);
        $scope.clinicalriesgocliente.obesity = fixFormatCharNumber(data.riesgo.obesity);
        $scope.clinicalriesgocliente.rheumatoid_arthritis = fixFormatCharNumber(data.riesgo.rheumatoid_arthritis);
        $scope.clinicalriesgocliente.less_than_14 = fixFormatCharNumber(data.riesgo.less_than_14);
        $scope.clinicalriesgocliente.current_pregnancy_yes = fixFormatCharNumber(data.riesgo.current_pregnancy_yes);
        $scope.clinicalriesgocliente.current_pregnancy_no = fixFormatCharNumber(data.riesgo.current_pregnancy_no);
        $scope.clinicalriesgocliente.current_pregnancy_monts = fixFormatCharNumber(data.riesgo.current_pregnancy_monts);
        $scope.clinicalriesgocliente.physical_disability_yes = fixFormatCharNumber(data.riesgo.physical_disability_yes);
        $scope.clinicalriesgocliente.physical_disability_no = fixFormatCharNumber(data.riesgo.physical_disability_no);
        $scope.clinicalriesgocliente.physical_disability_no_which = fixFormatCharNumber(data.riesgo.physical_disability_no_which);
        $scope.clinicalriesgocliente.recent_surgery_2months_yes = fixFormatCharNumber(data.riesgo.recent_surgery_2months_yes);
        $scope.clinicalriesgocliente.recent_surgery_2months_no = fixFormatCharNumber(data.riesgo.recent_surgery_2months_no);
        $scope.clinicalriesgocliente.recent_surgery_2months_which = fixFormatCharNumber(data.riesgo.recent_surgery_2months_which);
        $scope.clinicalriesgocliente.cardiac_pathology_no = fixFormatCharNumber(data.riesgo.cardiac_pathology_no);
        $scope.clinicalriesgocliente.cardiac_pathology_yes = fixFormatCharNumber(data.riesgo.cardiac_pathology_yes);
        $scope.clinicalriesgocliente.cardiac_pathology_which = fixFormatCharNumber(data.riesgo.cardiac_pathology_which);
        $scope.clinicalriesgocliente.hypertension_no = fixFormatCharNumber(data.riesgo.hypertension_no);
        $scope.clinicalriesgocliente.hypertension_which = fixFormatCharNumber(data.riesgo.hypertension_which);
        $scope.clinicalriesgocliente.hypertension_yes = fixFormatCharNumber(data.riesgo.hypertension_yes);
        $scope.clinicalriesgocliente.say_has_hepatitis = fixFormatCharNumber(data.riesgo.say_has_hepatitis);


      }


    });

    $scope.validateTheForm = true;
    $scope.formatNumberValue = 0;
    $scope.showrelatedto = false;
    $scope.showavoid = false;
    $scope.shownotroejercicio = false;


    $scope.shownosufre = false;
    $scope.showrelatedto2 = false;
    $scope.showrelacionadas = false;
    $scope.shownopalpitaciones = false;

    $scope.showmusculos = false;
    $scope.showdormir = false;
    $scope.showmedicina = false;
    $scope.showcirugia = false;
    $scope.showproblema = false;
    $scope.showfumar = false;
    $scope.showoral = false;
    $scope.showalcohol = false;
    $scope.showmenstrual = false;

    $scope.showembarazoa = false;
    $scope.showdiscapacidadf = false;
    $scope.showcirugiareciente = false;
    $scope.showpatologiac = false;
    $scope.showhiper = false;


    function fixFormatCharNumber(datares) {

      if (typeof datares === "string") {

        if (!isNaN(datares)) {
          return parseInt(datares);
        }
        return datares;

      } else {
        return datares;
      }

    }


    $scope.ocultarpalpitaciones = function () {
      if ($scope.clinicalriesgocliente.has_been_no == 1)
      {
        $scope.showrelatedto2 = false;
        $scope.clinicalriesgocliente.related_to_exercise = 0;
        $scope.clinicalriesgocliente.related_to_main_meal = 0;
        $scope.clinicalriesgocliente.related_to_emotion = 0;
        $scope.clinicalriesgocliente.related_to_cold = 0;
        $scope.clinicalriesgocliente.related_to_other = 0;
        $scope.clinicalriesgocliente.related_to_which = '';
        $scope.showrelacionadas = false;
        $scope.clinicalriesgocliente.has_been_pain = 0;
        $scope.clinicalriesgocliente.has_been_sweat = 0;
        $scope.clinicalriesgocliente.has_been_faint = 0;
        $scope.clinicalriesgocliente.has_been_seizures = 0;
        $scope.clinicalriesgocliente.has_been_vomiting = 0;
        $scope.clinicalriesgocliente.has_been_blurry_vision = 0;
        $scope.clinicalriesgocliente.has_been_mareo = 0;

      }

    }

    $scope.nopalpitaciones = function () {
      if ($scope.clinicalriesgocliente.has_been_pain == 1 || $scope.clinicalriesgocliente.has_been_sweat == 1 || $scope.clinicalriesgocliente.has_been_faint == 1 || $scope.clinicalriesgocliente.has_been_seizures == 1 || $scope.clinicalriesgocliente.has_been_vomiting == 1 || $scope.clinicalriesgocliente.has_been_blurry_vision == 1)
      {
        $scope.shownopalpitaciones = true;
        $scope.showrelatedto = true;
      } else {
        $scope.shownopalpitaciones = false;
        $scope.showrelatedto = false;
      }
    }


    $scope.otroejercicio2 = function () {
      if ($scope.clinicalriesgocliente.avoid_exercise_other == 1)
      {
        $scope.showavoid = true;
      } else
      {
        $scope.showavoid = false;

      }

    }


    $scope.otroejercicio = function () {
      if ($scope.clinicalriesgocliente.avoid_exercise_coronary_occlusion == 1 || $scope.clinicalriesgocliente.avoid_exercise_heart_murmur == 1 || $scope.clinicalriesgocliente.avoid_exercise_aneurysm == 1 || $scope.clinicalriesgocliente.avoid_exercise_dysautonomia == 1)
      {
        $scope.shownotroejercicio = true;
        $scope.clinicalriesgocliente.avoid_exercise_which = '';
      } else {
        $scope.shownotroejercicio = false;
      }
    }

    $scope.nosufre = function () {
      if ($scope.clinicalriesgocliente.suffering_headaches_rest == 1 || $scope.clinicalriesgocliente.suffering_headaches_effort == 1 || $scope.clinicalriesgocliente.suffering_headaches_after_effort == 1)
      {
        $scope.shownosufre = true;
      } else {
        $scope.shownosufre = false;
      }

    }


    $scope.relacionadas = function () {
      if ($scope.clinicalriesgocliente.related_to_other == 1)
      {
        $scope.showrelatedto2 = true;
      } else
      {
        $scope.showrelatedto2 = false;
      }

    }


    $scope.otrorelacionadas = function () {
      if ($scope.clinicalriesgocliente.related_to_cold == 1 || $scope.clinicalriesgocliente.related_to_emotion == 1 || $scope.clinicalriesgocliente.related_to_main_meal == 1 || $scope.clinicalriesgocliente.related_to_exercise == 1)
      {
        $scope.showrelacionadas = true;
        $scope.clinicalriesgocliente.related_to_which = '';
      } else {
        $scope.showrelacionadas = false;
      }
    }


    $scope.ocultosteomuscular = function () {
      if ($scope.clinicalriesgocliente.musculoskeletal_problems_yes == 1)
      {
        $scope.showmusculos = true;
      } else
      {
        $scope.showmusculos = false;
      }

    }

    $scope.ocultosteomuscularno = function () {
      if ($scope.clinicalriesgocliente.musculoskeletal_problems_no == 1)
      {
        $scope.clinicalriesgocliente.musculoskeletal_problems_yes == 0;
        $scope.clinicalriesgocliente.musculoskeletal_problems_which = '';
        $scope.showmusculos = false;
      }
    }



    $scope.dormir = function () {
      if ($scope.clinicalriesgocliente.sleep_medication_yes == 1)
      {
        $scope.showdormir = true;
      } else
      {
        $scope.showdormir = false;
      }

    }

    $scope.dormir2 = function () {
      if ($scope.clinicalriesgocliente.sleep_medication_no == 1)
      {
        $scope.showdormir = false;
        $scope.clinicalriesgocliente.sleep_medication_which = '';
      }
    }

    $scope.medicamento = function () {
      if ($scope.clinicalriesgocliente.consume_special_medicine_yes == 1)
      {
        $scope.showmedicina = true;
      } else
      {
        $scope.showmedicina = false;
      }

    }

    $scope.medicamento2 = function () {
      if ($scope.clinicalriesgocliente.consume_special_medicine_no == 1)
      {
        $scope.showmedicina = false;
        $scope.clinicalriesgocliente.consume_special_medicine_which = '';
      }
    }

    $scope.cirugia = function () {
      if ($scope.clinicalriesgocliente.sugeries_yes == 1)
      {
        $scope.showcirugia = true;
      } else
      {
        $scope.showcirugia = false;
      }

    }

    $scope.cirugia2 = function () {
      if ($scope.clinicalriesgocliente.sugeries_no == 1)
      {
        $scope.showcirugia = false;
        $scope.clinicalriesgocliente.sugeries_which = '';
      }
    }


    $scope.problemas = function () {
      if ($scope.clinicalriesgocliente.back_problems_yes == 1)
      {
        $scope.showproblema = true;
      } else
      {
        $scope.showproblema = false;
      }
    }

    $scope.problemas2 = function () {
      if ($scope.clinicalriesgocliente.back_problems_no == 1)
      {
        $scope.showproblema = false;
        $scope.clinicalriesgocliente.back_problems = '';
        $scope.clinicalriesgocliente.back_problems_demonstration = '';
      }
    }

    $scope.fuma = function () {
      if ($scope.clinicalriesgocliente.smoking_yes == 1)
      {
        $scope.showfumar = true;
      } else
      {
        $scope.showfumar = false;
      }

    }

    $scope.fuma2 = function () {
      if ($scope.clinicalriesgocliente.smoking_no == 1)
      {
        $scope.showfumar = false;
        $scope.clinicalriesgocliente.smoking_since_when = '';
        $scope.clinicalriesgocliente.smoking_how_day = '';
        $scope.clinicalriesgocliente.smoking_how_much_leave = '';

      }
    }

    $scope.anticonceptivos = function () {
      if ($scope.clinicalriesgocliente.consume_contraceptives_oral_yes == 1)
      {
        $scope.showoral = true;
      } else
      {
        $scope.showoral = false;
      }

    }

    $scope.anticonceptivos2 = function () {
      if ($scope.clinicalriesgocliente.consume_contraceptives_oral_no == 1)
      {
        $scope.showoral = false;
        $scope.clinicalriesgocliente.consume_contraceptives_oral_which = '';
        $scope.clinicalriesgocliente.consume_contraceptives_oral_g = '';
        $scope.clinicalriesgocliente.consume_contraceptives_oral_p = '';
        $scope.clinicalriesgocliente.consume_contraceptives_oral_ces = '';
        $scope.clinicalriesgocliente.consume_contraceptives_oral_alive = '';

      }
    }

    $scope.alcohol = function () {
      if ($scope.clinicalriesgocliente.alcohol_yes == 1)
      {
        $scope.showalcohol = true;
      } else
      {
        $scope.showalcohol = false;
      }

    }

    $scope.alcohol2 = function () {
      if ($scope.clinicalriesgocliente.alcohol_no == 1)
      {
        $scope.showalcohol = false;
        $scope.clinicalriesgocliente.alcohol_beer == 0;
        $scope.clinicalriesgocliente.alcohol_wine == 0;
        $scope.clinicalriesgocliente.alcohol_liqueur == 0;
        $scope.clinicalriesgocliente.alcohol_how_many_times_week = '';
        $scope.clinicalriesgocliente.alcohol_few_times_month = '';

      }
    }

    $scope.menstrual = function () {
      if ($scope.clinicalriesgocliente.menstrual_disorders_yes == 1)
      {
        $scope.showmenstrual = true;
      } else
      {
        $scope.showmenstrual = false;
      }

    }

    $scope.menstrual2 = function () {
      if ($scope.clinicalriesgocliente.menstrual_disorders_no == 1)
      {
        $scope.showmenstrual = false;
        $scope.clinicalriesgocliente.menstrual_disorders_which = '';
      }
    }

    $scope.actsuma = function () {

      $scope.clinicalriesgocliente.tests_anthropometry_basic_total = parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_tr) + parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_se) +
              parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_si) + parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_abd) +
              parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_m) + parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_p);

      $scope.clinicalriesgocliente.tests_anthropometry_basic_total = parseFloat($scope.clinicalriesgocliente.tests_anthropometry_basic_total.toFixed(2));

      $scope.valueTotalM();
      $scope.valueTotalF();

    }

    /*$scope.imc = function () {
     
     $scope.clinicalriesgocliente.physical_exam_imc = parseFloat($scope.clinicalriesgocliente.physical_exam_weight) / (parseFloat($scope.clinicalriesgocliente.physical_exam_size) * parseFloat($scope.clinicalriesgocliente.physical_exam_size));
     
     $scope.clinicalriesgocliente.physical_exam_imc = parseFloat($scope.clinicalriesgocliente.physical_exam_imc.toFixed(2));
     
     }*/




    $scope.embarazo = function () {
      if ($scope.clinicalriesgocliente.current_pregnancy_yes == 1)
      {
        $scope.showembarazoa = true;
      } else
      {
        $scope.showembarazoa = false;
      }

    }

    $scope.embarazo2 = function () {
      if ($scope.clinicalriesgocliente.current_pregnancy_no == 1)
      {
        $scope.showembarazoa = false;
        $scope.clinicalriesgocliente.current_pregnancy_monts = '';
      }
    }

    $scope.discapacidad = function () {
      if ($scope.clinicalriesgocliente.physical_disability_yes == 1)
      {
        $scope.showdiscapacidadf = true;
      } else
      {
        $scope.showdiscapacidadf = false;
      }

    }

    $scope.discapacidad2 = function () {
      if ($scope.clinicalriesgocliente.physical_disability_no == 1)
      {
        $scope.showdiscapacidadf = false;
        $scope.clinicalriesgocliente.physical_disability_no_which = '';
      }
    }

    $scope.cirureciente = function () {
      if ($scope.clinicalriesgocliente.recent_surgery_2months_yes == 1)
      {
        $scope.showcirugiareciente = true;
      } else
      {
        $scope.showcirugiareciente = false;
      }

    }

    $scope.cirureciente2 = function () {
      if ($scope.clinicalriesgocliente.recent_surgery_2months_no == 1)
      {
        $scope.showcirugiareciente = false;
        $scope.clinicalriesgocliente.recent_surgery_2months_which = '';
      }
    }

    $scope.patologia = function () {
      if ($scope.clinicalriesgocliente.cardiac_pathology_yes == 1)
      {
        $scope.showpatologiac = true;
      } else
      {
        $scope.showpatologiac = false;
      }

    }

    $scope.patologia2 = function () {
      if ($scope.clinicalriesgocliente.cardiac_pathology_no == 1)
      {
        $scope.showpatologiac = false;
        $scope.clinicalriesgocliente.cardiac_pathology_which = '';
      }
    }

    $scope.hipertension = function () {
      if ($scope.clinicalriesgocliente.hypertension_yes == 1)
      {
        $scope.showhiper = true;
      } else
      {
        $scope.showhiper = false;
      }

    }

    $scope.hipertension2 = function () {
      if ($scope.clinicalriesgocliente.hypertension_no == 1)
      {
        $scope.showhiper = false;
        $scope.clinicalriesgocliente.rieshypertension_which = '';
      }
    }


    $scope.changeAge = function () {

      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/clientes/ageWithDate/" + $scope.client.date_birth)
              .success(function (response) {
                $scope.msg_age = response.age + " años";
                $scope.age = response.age;
              });

    }

    $scope.currentHours = function () {

      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/currentHours")
              .success(function (response) {

                $scope.hours = response.hours;
              });

    }

    $scope.currentDate = function () {

      $http.get(ServicePathDomain.domain() + CONFIG.URLHTTP + "/currentDate")
              .success(function (response) {

                $scope.date = response.date;
              });

    }

    $scope.currentHours();
    $scope.currentDate();

    $scope.find = function ()
    {

      var $urlfilter = "";
      $scope.msg_btn_deletes = 'Mostrar Eliminados';
      deletes = false;

      if ($.trim($scope.filtertext) != "") {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/historias_con_filtro/" + $scope.filtertext
      } else {
        $urlfilter = ServicePathDomain.domain() + CONFIG.URLHTTP + "/historias_con_filtro";
      }

      $http.get($urlfilter)
              .success(function (response) {
                $scope.data = response.clinical;
              });

    }


    /*$scope.printhistory = function(){
     
     var printContents = document.getElementById('skin-blur-kiwi').innerHTML;
     document.body.innerHTML = printContents;
     $scope.isPagePrint = true;
     window.print();    
     }*/


    $scope.submit = function (form) {

      $scope.settings.processing = true;
      $scope.settings.success = false;
      $scope.validateTheForm = true;
      $timeout(function () {
        $scope.validateTheForm = form.$valid
      }, 1000);

      $timeout(function () {
        if (form.$valid) {

          $scope.settings.processing = true;


          if ($scope.siestaguardando) {
            Clinicals.save($scope.clinicalriesgocliente).$promise
                    .then(function (data)
                    {
                      if (data.msg)
                      {
                        //$location.path("/clinical");
                        $scope.settings.success = "Información Guardada Correctamente";
                        $scope.siestaguardando = false;
                      }
                      $scope.settings.processing = false;

                    }).catch(function (data)
            {
              $scope.settings.processing = false;
              $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
            });

          } else {
            Clinicals.update({id: idcliente}, $scope.clinicalriesgocliente).$promise
                    .then(function (data)
                    {
                      if (data.msg)
                      {
                        // $location.path("/clinical");
                        $scope.settings.success = "Información Guardada Correctamente";
                      }
                      $scope.settings.processing = false;

                    }).catch(function (data)
            {
              $scope.settings.processing = false;
              $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
            });
          }



        } else {
          $scope.settings.processing = false;
        }
      }, 1000);

    }


    $scope.isEdit = function () {
      return false;
    }

    $scope.isShow = function () {
      return false;
    }

    $scope.openDateEndClinical = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.settings.openedDateBirthday = true;
    };


    $scope.tabs = [{
        title: 'Ant. Personales',
        url: 'AntecedentesPersonales'
      },
      {
        title: 'Le han dicho',
        url: 'lehandicho'
      },
      {
        title: 'Hábitos',
        url: 'habitos'
      },
      {
        title: 'Ant. Familiares',
        url: 'antecedentesfamiliares'
      },
      {
        title: 'Otras Valoraciones',
        url: 'otrasvaloraciones'
      },
      {
        title: 'Medidas',
        url: 'medidas'
      },
      {
        title: 'Act. Física',
        url: 'actividadfisica'
      },
      {
        title: 'Formulario Riesgos',
        url: 'formularioriesgos'
      }];

    $scope.currentTab = 'AntecedentesPersonales';

    $scope.onClickTab = function (tab) {
      $scope.currentTab = tab.url;
    }

    $scope.onClickTabWithURL = function (taburl) {
      $scope.currentTab = taburl;
    }

    $scope.isActiveTab = function (tabUrl) {
      return tabUrl == $scope.currentTab;
    }


  }]);




appGimnasio.controller('ClinicalEditCtrl', ['$scope', '$rootScope','FingerprintF', '$timeout', '$location', '$http', 'Clinicals', 'ServicePathDomain', 'CONFIG', '$routeParams', function ($scope, $rootScope,FingerprintF, $timeout, $location, $http, Clinicals, ServicePathDomain, CONFIG, $routeParams) {

    $rootScope.loginStatus = false;

    $rootScope.user.name = localStorage.user_name;
FingerprintF.calcelStatusAccess();
    $rootScope.user.dataurl = localStorage.user_dataurl;

    $scope.settings = {
      pageTitle: "Editar Historia Clínica",
      action: "Edit",
      dateFormat: 'yyyy/MM/dd',
      openedDateBirthday: false,
      success: false,
      processing: false
    };

    var id = $routeParams.id;

    $scope.validateTheForm = true;
    $scope.formatNumberValue = 0;



    Clinicals.get({id: id}, function (data)
    {

      data.clinical.duration_days = parseInt(data.clinical.duration_days);
      $scope.clinical = data.clinical;


    });




    $scope.submit = function (form) {

      $scope.settings.processing = true;
      $scope.settings.success = false;
      $scope.validateTheForm = true;
      $timeout(function () {
        $scope.validateTheForm = form.$valid
      }, 1000);

      $timeout(function () {
        if (form.$valid) {

          $scope.settings.processing = true;
          Clinicals.update({id: id}, $scope.clinical).$promise
                  .then(function (data)
                  {
                    if (data.msg)
                    {
                      $scope.settings.success = "Historia Clínica Editada correctamente";
                    }
                    $scope.settings.processing = false;

                  }).catch(function (data)
          {
            $scope.settings.processing = false;
            $scope.settings.success = "A ocurrido un error, por favor vuelva intentarlo. Si el error persiste comuniquese con el administrador";
          });

        } else {
          $scope.settings.processing = false;
        }
      }, 500);

    }



    $scope.isEdit = function () {
      return true;
    }

    $scope.isShow = function () {
      return false;
    }

    $scope.openDateEndClinical = function ($event) {
      $event.preventDefault();
      $event.stopPropagation();
      $scope.settings.openedDateBirthday = true;
    };


  }]);
