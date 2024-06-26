import {faker} from '@faker-js/faker'

var post_title = ''
var post_content = ''
const version_ghost = '5-82/'
const ep_login = '/signin'

describe("Ghost CMS Test Suite - Nicolas Ibarra", function () {
  
  // Escenario 1: Prueba de inicio de sesión, creación y publicación de un nuevo post
  it("Scenario 1: Login, create & publish post, and validate in site & post list", function () {
    login(ep_login, version_ghost);
    create_post();
    publish_post();
    validate_post_on_site();
    validate_post_list();
  });

  // Escenario 2: Prueba de edición de un post existente y verificación de los cambios
  it("Scenario 2: Edit existing post, save, publish, and validate changes", function () {
    login(ep_login, version_ghost);
    create_post();
    edit_post();
    save_draft();
    publish_post();
    validate_post_on_site();
  });
  

  it("Scenario 3: Login to Ghost CMS - injection code - verify injeccion", function () {

    const  injeccion_code = "<div><p>injeccion de codigo existosa</p></div>";

    login(ep_login, version_ghost);
    inject_code(injeccion_code);
    verifyAlertOnHomePage(injeccion_code);
  });

  // Escenario 4: Prueba de configuración del sitio y verificación de los cambios
  it("Scenario 4: Change site settings and verify changes", function () {

    const new_title = "GHOST - MISO KRAKENS"

    login(ep_login, version_ghost);
    change_site_settings(new_title);
    verify_settings(new_title);
  });

  // Escenario 5: Prueba de eliminación de un post y un usuario
  it("Scenario 5: Delete post, delete user, and verify deletion", function () {
    login(ep_login, version_ghost);
    create_post();
    delete_post();
    create_user();
    delete_user();
    verify_deletion();
  });

  // Escenario 6: Prueba de creación, asignación y eliminación de etiquetas en un post
  it("Scenario 6: Create, assign & delete tags for a post", function () {
    //const post_title = "Test Post with Tags";
    const visitar = true;

    login();
    create_post();
    create_tags(["Tag1", "Tag2", "Tag3"]);
    assign_tags_to_post(post_title, ["Tag1", "Tag2", "Tag3"]);
    validate_tags_on_post(post_title, ["Tag1", "Tag2", "Tag3"]);
    remove_tags_from_post(post_title, ["Tag1", "Tag2", "Tag3"]);
    validate_tags_removed_from_post(post_title, ["Tag1", "Tag2", "Tag3"]);
  });

  // Funciones auxiliares

  function login(screenshotPath, version) {
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/signin");
    cy.wait(1000);
    cy.get('input[name="identification"]').type("n.ibarra@uniandes.edu.co", {
      force: true,
    });
    cy.get('input[name="password"]').type("yx33_zoombex$/", { force: true });
    cy.screenshot(version+screenshotPath+'loginForm');
    cy.get('button[type="submit"]').click({ force: true }).wait(3000);
  }

  function create_post(screenshotPath, version) {
    cy.contains('New post').click({ force: true });
    cy.wait(3000);
    // if(visitar === true){
    //   cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts").wait(3000);
    // }
    
    post_title = faker.lorem.word();
    post_content = faker.lorem.paragraph();
    // Llena el formulario de creación de publicación
    cy.get('textarea[placeholder="Post Title"]').type(post_title).wait(3000);
    cy.get('div[data-placeholder="Begin writing your post..."]').type(post_content).wait(3000);

    cy.screenshot(version+screenshotPath+'fillPostForm');
    // Guarda la publicación
    cy.contains('Publish').click().wait(2000);
    
  }

  function publish_post(screenshotPath, version) {
    // Publica el post
    cy.get('button[class="gh-btn gh-btn-blue gh-publishmenu-button gh-btn-icon ember-view"]').click().wait(2000);
    //cy.contains('Publish').click().wait(3000);
    //cy.contains('Continue, final review').click().wait(3000);
  }

  function validate_post_on_site(screenshotPath, version) {
    // Valida el post en el sitio
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net").wait(3000).screenshot(version+screenshotPath+'verifyPost');
    //cy.contains(post_title).click().wait(2000);
    cy.contains(post_title).should('exist');
    // cy.get('h1[class="post-full-title"]').then(($header)=>{
    //     expect($header[0].innerText).to.equal(post_title)
    // })
    // cy.get('div[class="post-content"]').then(($content)=>{
    //     expect($content[0].innerText).to.equal(post_content)
    // })
  }

  function validate_post_list(screenshotPath, version) {
    // Valida la lista de posts
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts?type=published").wait(3000).screenshot(version+screenshotPath+'verifyPostList');
    cy.get('h3[class="gh-content-entry-title"]').then(
        ($titles) => {
            expect($titles[0].innerText).to.equal(post_title)
        }
    )
  }

  function edit_post(screenshotPath, version) {
    // Edita un post existente
    post_title = faker.lorem.word();

    cy.get('textarea[placeholder="Post Title"]').type("{selectall}{backspace}").type(post_title).wait(1000);
    cy.get('div[data-placeholder="Begin writing your post..."]').type("{selectall}{backspace}").type("Edited Content").wait(2000);

    cy.screenshot(version+screenshotPath+'editPost');

  }

  function save_draft(screenshotPath, version) {
    // Guarda el post como borrador
    cy.contains('Publish').click().wait(2000);
    cy.screenshot(version+screenshotPath+'saveDraft');

    cy.get('button[class="gh-btn gh-btn-blue gh-publishmenu-button gh-btn-icon ember-view"]').click().wait(2000);

}

  function create_user() {
    // Crea un nuevo usuario
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/staff").wait(2000);
    cy.contains('Invite people').click().wait(2000);
    const email = faker.internet.email();
    cy.get('input[name="email"]').type(email, { force: true }).wait(1000);

    cy.screenshot(version+screenshotPath+'createUser');

    cy.contains('Send invitation now').click().wait(2000);
  }

  function assign_role() {
    // Asigna un rol a un usuario
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/staff").wait(2000);
    cy.get('select[name="role"]').select('Editor').wait(2000);
    cy.contains('Update').click().wait(2000);
  }

  function verify_permissions() {
    // Verifica los permisos de un usuario
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/staff").wait(2000);
    cy.contains('View site').should('exist');
  }

  function change_site_settings(new_title) {
    // Cambia la configuración del sitio
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/settings/general").wait(2000);
    
    cy.get('button[class="gh-btn"]').first().click().wait(3000);
    cy.get('input#ember102.gh-input').clear().type(new_title, { force: true }).wait(1000);
    cy.contains('Save settings').click().wait(2000);
  }

  function verify_settings(new_title) {
    // Verifica los cambios en la configuración del sitio
    // Podrías implementar la lógica para verificar cambios aquí
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net").wait(2000);
    cy.contains(new_title).should('exist');
  }

  function delete_post() {
    // Elimina un post
    // Podrías implementar la lógica para eliminar un post aquí
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts?type=published").wait(2000);
    //cy.get('button[title="Leave"]').first().click().wait(2000);
    cy.get('a[title="Edit this post"]').first().click().wait(2000);
    
    //cy.get('button[class="gh-btn gh-btn-red gh-btn-icon ember-view"]').click().wait(2000);
    
  }

  function delete_user() {
    // Elimina un usuario
    // Podrías implementar la lógica para eliminar un usuario aquí
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/staff").wait(2000);
    //cy.get('button[title="Revoke invitation"]').first().click().wait(2000);
    cy.contains('Revoke').first().click().wait(2000);
    //cy.get('button[class="gh-btn gh-btn-red gh-btn-icon ember-view"]').click().wait(2000);
    
  }

  function verify_deletion(post_title) {
    // Verifica que la publicación eliminada no exista en la lista de publicaciones
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts?type=published").wait(2000);
    cy.get('h3[class="gh-content-entry-title"]').should('not.contain', post_title);

    // Verifica que no haya ningún mensaje indicando que no se encontraron publicaciones
    cy.contains('No posts found').should('not.exist');

    // Verifica que no haya ningún usuario en la lista de usuarios
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/staff").wait(2000);
    cy.contains('No staff members found').should('not.exist');
}

function inject_code(injeccion_code) {
    // Navegar a la sección de Code Injection

    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/settings/code-injection").wait(2000);


    cy.get('.CodeMirror-code [role="presentation"]').first()
    .then(($element) => {
        // Obtenemos el elemento DOM
        const element = $element[0];
        // Limpiamos el contenido del elemento reemplazándolo con una cadena vacía
        element.innerText = '';
        element.innerText = injeccion_code;
    }).wait(2000);


    // Guardar la configuración
    cy.contains('Save').click().wait(2000);

}

function verifyAlertOnHomePage(injeccion_code) {
    // Ir a la página principal
    cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net");

    cy.contains('injeccion de codigo existosa')
        .should('exist');
    

}

/////////////////////////////////////////////////////////
// Funciones Auxiliares
function create_tags(tags) {
  // Crear nuevas etiquetas
  tags.forEach(tag => {
      cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/tags/new").wait(2000);
      cy.get('input[name="name"]').type(tag).wait(1000);
      cy.contains('Save').click().wait(2000);
  });
}

// function assign_tags_to_post(post_title, tags) {
//   // Asignar etiquetas a un post
//   cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts?type=draft").wait(2000);
//   cy.contains(post_title).click().wait(2000);
//   cy.get('.post-settings').click().wait(1000);
//   tags.forEach(tag => {
//       cy.get('input.ember-power-select-trigger-multiple-input').type(tag).wait(1000);
//       cy.contains(tag).click().wait(1000);
//   });
//   cy.get('.modal-footer').contains('Update').click().wait(2000);
// }
function assign_tags_to_post(post_title, tags) {
  // Asignar etiquetas a un post
  cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts?type=draft").wait(2000);
  cy.contains(post_title).click().wait(2000);
  cy.get('.post-settings').click().wait(1000);
  tags.forEach(tag => {
      //cy.contains("input#ember-power-select-trigger-multiple-input-ember969").click().wait(1000);
      //cy.get('.ember-power-select-search-input').type(tag).wait(1000);
      cy.get('.ember-power-select-trigger-multiple-input').first().type(tag).wait(1000);

      cy.contains(tag).click().wait(1000);
      
  });
  //cy.get('.gh-publishmenu-trigger').click().wait(1000);
  //cy.get('.gh-publishmenu-radio-label').contains('Feature this post').click().wait(1000);
  //cy.get('.modal-footer').contains('Update').click().wait(2000);
  cy.contains('Feature this post').click().wait(1000);
}

// function validate_tags_on_post(post_title, tags) {
//   // Validar la presencia de etiquetas en un post
//   cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net").wait(2000);
//   cy.contains(post_title).click().wait(2000);
//   tags.forEach(tag => {
//       cy.contains(tag).should('exist');
//   });
// }
function validate_tags_on_post(post_title, tags) {
  // Validar la presencia de etiquetas en un post
  cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts").wait(2000);


  // Verificar la presencia de cada etiqueta en el post
  // tags.forEach(tag => {
  //     cy.get('.post-settings').contains(tag).should('exist');
  // });
  let tagExists = false;

  // Verificar la presencia de cada etiqueta en el post
  tags.forEach(tag => {
      cy.contains(tag).should('exist').then(() => {
          tagExists = true;
      });
  });

}

function remove_tags_from_post(post_title, tags) {
  // Eliminar etiquetas de un post
  cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net/ghost/#/posts?type=draft").wait(2000);
  cy.contains(post_title).click().wait(2000);
  cy.get('.post-settings').click().wait(1000);
  tags.forEach(tag => {
      cy.get('.tag').contains(tag).parent().find('.delete').click().wait(1000);
  });
  cy.get('.modal-footer').contains('Update').click().wait(2000);
}

function validate_tags_removed_from_post(post_title, tags) {
  // Validar que las etiquetas hayan sido eliminadas de un post
  cy.visit("https://ghost-miso41032202412-equipo21.azurewebsites.net").wait(2000);
  cy.contains(post_title).click().wait(2000);
  tags.forEach(tag => {
      cy.contains(tag).should('not.exist');
  });
}


});
